import { useCallback, useEffect, useState } from "react";

import { isSupabaseConfigured, supabase } from "supabaseClient";

const TABLE_NAME = "FlightDetails";
const missingConfigMessage = "Missing Supabase URL or publishable key in .env";

export const emptyFlightForm = {
  TailNumber: "",
  FlightID: "",
  TakeOff_Time: "",
  Landing_Time: "",
  Duration: "",
};

function toDatetimeInputValue(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 16);
}

export function formatFlightDuration(takeoffTime, landingTime) {
  if (!takeoffTime || !landingTime) return "-";

  const takeoff = new Date(takeoffTime);
  const landing = new Date(landingTime);

  if (
    Number.isNaN(takeoff.getTime()) ||
    Number.isNaN(landing.getTime()) ||
    landing < takeoff
  ) {
    return "-";
  }

  const totalMinutes = Math.round((landing - takeoff) / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours && minutes) return `${hours}h ${minutes}mins`;
  if (hours) return `${hours}h`;
  return `${minutes}mins`;
}

function toPayload(values) {
  const autoDuration = formatFlightDuration(
    values.TakeOff_Time,
    values.Landing_Time,
  );
  const manualDuration = values.Duration?.trim();
  const duration =
    manualDuration || (autoDuration === "-" ? null : autoDuration);

  return {
    TailNumber: values.TailNumber.trim(),
    FlightID: values.FlightID.trim(),
    TakeOff_Time: values.TakeOff_Time
      ? new Date(values.TakeOff_Time).toISOString()
      : null,
    Landing_Time: values.Landing_Time
      ? new Date(values.Landing_Time).toISOString()
      : null,
    Duration: duration,
  };
}

function assertSupabaseConfigured() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(missingConfigMessage);
  }
}

export function getFlightFormValues(flight) {
  if (!flight) return emptyFlightForm;

  return {
    TailNumber: flight.TailNumber ?? "",
    FlightID: flight.FlightID ?? "",
    TakeOff_Time: toDatetimeInputValue(flight.TakeOff_Time),
    Landing_Time: toDatetimeInputValue(flight.Landing_Time),
    Duration: flight.Duration ?? "",
  };
}

export function useFlightDetailsStore() {
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchFlights = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setFlights([]);
      setErrorMessage(missingConfigMessage);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("id,TailNumber,FlightID,TakeOff_Time,Landing_Time,Duration")
      .order("id", { ascending: true });

    if (error) {
      setErrorMessage(error.message);
      setFlights([]);
    } else {
      setFlights(data ?? []);
    }

    setIsLoading(false);
  }, []);

  const createFlight = useCallback(async (values) => {
    assertSupabaseConfigured();
    setIsSaving(true);

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(toPayload(values))
      .select()
      .single();

    setIsSaving(false);

    if (error) throw error;

    setFlights((current) => [...current, data]);
    return data;
  }, []);

  const updateFlight = useCallback(async (id, values) => {
    assertSupabaseConfigured();
    setIsSaving(true);

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(toPayload(values))
      .eq("id", id)
      .select()
      .single();

    setIsSaving(false);

    if (error) throw error;

    setFlights((current) =>
      current.map((flight) => (flight.id === id ? data : flight)),
    );
    return data;
  }, []);

  const deleteFlight = useCallback(async (id) => {
    assertSupabaseConfigured();
    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

    if (error) throw error;

    setFlights((current) => current.filter((flight) => flight.id !== id));
  }, []);

  const deleteFlights = useCallback(async (ids) => {
    assertSupabaseConfigured();
    if (!ids.length) return;

    const { error } = await supabase.from(TABLE_NAME).delete().in("id", ids);

    if (error) throw error;

    setFlights((current) =>
      current.filter((flight) => !ids.includes(flight.id)),
    );
  }, []);

  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]);

  return {
    flights,
    isLoading,
    isSaving,
    errorMessage,
    fetchFlights,
    createFlight,
    updateFlight,
    deleteFlight,
    deleteFlights,
  };
}

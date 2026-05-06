// Import Dependencies
import { EnvelopeIcon, PhoneIcon, UserIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Button, Input } from "components/ui";

// ----------------------------------------------------------------------

export default function General() {
  return (
    <div className="w-full max-w-3xl 2xl:max-w-5xl">
      <h5 className="text-lg font-medium text-gray-800 dark:text-dark-50">
        General
      </h5>
      <p className="mt-0.5 text-balance text-sm text-gray-500 dark:text-dark-200">
        Update your account settings.
      </p>
      <div className="my-5 h-px bg-gray-200 dark:bg-dark-500" />
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 [&_.prefix]:pointer-events-none">
        <Input
          placeholder="Enter Nickname"
          label="Display name"
          className="rounded-xl"
          prefix={<UserIcon className="size-4.5" />}
        />
        <Input
          placeholder="Enter FullName"
          label="Full name"
          className="rounded-xl"
          prefix={<UserIcon className="size-4.5" />}
        />
        <Input
          placeholder="Enter Email"
          label="Email"
          className="rounded-xl"
          prefix={<EnvelopeIcon className="size-4.5" />}
        />
        <Input
          placeholder="Phone Number"
          label="Phone Number"
          className="rounded-xl"
          prefix={<PhoneIcon className="size-4.5" />}
        />
      </div>
      <div className="mt-8 flex justify-end space-x-3 ">
        <Button className="min-w-[7rem]">Cancel</Button>
        <Button className="min-w-[7rem]" color="primary">
          Save
        </Button>
      </div>
    </div>
  );
}

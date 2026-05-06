import { NAV_TYPE_ITEM, } from "constants/app.constant";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { MdOutlineAirplaneTicket } from "react-icons/md";

export const baseNavigation = [
    {
        id: 'flight',
        type: NAV_TYPE_ITEM,
        path: '/flight',
        title: 'Flight',
        transKey: 'nav.dashboards.dashboards',
        Icon: MdOutlineAirplaneTicket,
    },
    {
        id: 'usermanagement',
        type: NAV_TYPE_ITEM,
        path: '/usermanagement',
        title: 'User Management',
        transKey: 'nav.usermanagement.usermanagement',
        Icon: UserGroupIcon,
    },
]

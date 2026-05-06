import { UserGroupIcon } from '@heroicons/react/24/outline';
import { MdOutlineAirplaneTicket } from "react-icons/md";
import { NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_FLIGHT = '/flight'
const ROOT_USER_MANAGEMENT = '/usermanagement'

export const dashboards = {
    id: 'flight',
    type: NAV_TYPE_ITEM,
    path: ROOT_FLIGHT,
    title: 'Flight',
    transKey: 'nav.dashboards.dashboards',
    Icon: MdOutlineAirplaneTicket,
}

export const userManagement = {
    id: 'usermanagement',
    type: NAV_TYPE_ITEM,
    path: ROOT_USER_MANAGEMENT,
    title: 'User Management',
    transKey: 'nav.usermanagement.usermanagement',
    Icon: UserGroupIcon,
}

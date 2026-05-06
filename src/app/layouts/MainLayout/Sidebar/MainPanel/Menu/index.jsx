// Import Dependencies
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

// Local Imports
import { ScrollShadow } from "components/ui";
import { Item } from "./Item";

// ----------------------------------------------------------------------

export function Menu({ nav, activeSegment }) {
  const { t } = useTranslation();

  const getProps = ({ path, title, transKey, linkProps }) => {
    return {
      component: Link,
      to: path,
      ...linkProps,
      isActive: path === activeSegment,
      title: t(transKey) || title,
      path,
    };
  };

  return (
    <ScrollShadow
      data-root-menu
      className="hide-scrollbar flex w-full grow flex-col items-center space-y-4 overflow-y-auto pt-5 lg:space-y-3 xl:pt-5 2xl:space-y-4"
    >
      {nav.map(({ id, Icon, path, title, transKey, linkProps }) => {
        return (
          <Item
            key={path}
            {...getProps({ path, title, transKey, linkProps })}
            id={id}
            Icon={Icon}
          />
        );
      })}
    </ScrollShadow>
  );
}

Menu.propTypes = {
  nav: PropTypes.array,
  activeSegment: PropTypes.string,
};

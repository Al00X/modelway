import { Menu } from '@mantine/core';

export const ContextMenu = (props: { children?: any; open: boolean; onClose: () => void }) => {
  return (
    <Menu
      opened={props.open}
      onChange={() => {
        props.onClose();
      }}
    >
      <Menu.Dropdown>
        <p>asdasd</p>
      </Menu.Dropdown>
    </Menu>
  );
};

// eslint-disable-next-line import/no-named-as-default
import toast from 'react-hot-toast';

export function openToast(text: string) {
  toast(text, {
    duration: 1500,
    position: 'bottom-center',
    style: {
      background: '#f1efef',
      color: '#1a1919',
      fontWeight: 500,
    },
  });
}

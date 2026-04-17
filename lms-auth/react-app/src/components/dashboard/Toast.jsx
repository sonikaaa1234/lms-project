import { useApp } from '../../context/useApp';

export default function Toast() {
  const { toast } = useApp();
  return (
    <div className={`toast ${toast.type} ${toast.show ? 'show' : ''}`}>
      {toast.msg}
    </div>
  );
}

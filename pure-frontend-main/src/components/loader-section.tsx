import LoadingSpinner from './loader';

export default function LoadingSection({
  className,
  spinnerClassName,
}: {
  className?: string;
  spinnerClassName?: string;
}) {
  return (
    <div
      className={`w-full flex justify-center justify-items-center h-full ${className}`}
    >
      <LoadingSpinner className={`m-auto h-16 w-16 ${spinnerClassName}`} />
    </div>
  );
}

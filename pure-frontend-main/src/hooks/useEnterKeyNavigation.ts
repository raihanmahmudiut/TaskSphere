import { useEffect } from 'react';

export function useEnterKeyNavigation(
    formRef: React.RefObject<HTMLFormElement>
) {
    useEffect(() => {
        const handleSubmit = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const form = formRef.current;

                if (form) {
                    const focusableElements = Array.from(
                        form.querySelectorAll(
                            'input[data-focusable], textarea[data-focusable], select[data-focusable]'
                        )
                    ) as HTMLInputElement[];

                    const focusedElement =
                        document.activeElement as HTMLElement;
                    const currentIndex = focusableElements.indexOf(
                        focusedElement as HTMLInputElement
                    );
                    const nextElement = focusableElements[currentIndex + 1] as
                        | HTMLElement
                        | undefined;

                    if (nextElement) {
                        nextElement.focus();
                    } else {
                        form.requestSubmit();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleSubmit);

        return () => {
            document.removeEventListener('keydown', handleSubmit);
        };
    }, [formRef]);
}

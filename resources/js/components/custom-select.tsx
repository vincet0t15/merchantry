import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
interface Option {
    label: string;
    value: string;
}

interface CustomSelectProps {
    options?: Option[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    widthClass?: string;
    disabled?: boolean;
    name: string;
    tabIndex?: number;
}

export default function CustomSelect({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    widthClass = 'w-[180px]',
    disabled,
    tabIndex,
}: CustomSelectProps) {
    const safeValue = value === '0' || value === '' ? undefined : value;
    return (
        <Select
            value={safeValue}
            onValueChange={onChange}
            disabled={disabled}
        >
            <SelectTrigger className={widthClass} tabIndex={tabIndex}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

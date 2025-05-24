// components/StarRating.tsx
import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils"; // shadcn/ui class merging utility

interface StarRatingProps {
    value?: number; // Can be fractional like 3.5
    onChange?: (rating: number) => void;
    max?: number; // default 5
    readOnly?: boolean;
    size?: "sm" | "md" | "lg";
    fillColor?: string;
}

const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
};

export const StarRating: React.FC<StarRatingProps> = ({ value = 0, onChange, max = 5, readOnly = false, size = "md", fillColor = "text-yellow-400 fill-yellow-400" }) => {

    const [hovered, setHovered] = useState<number | null>(null);
    const displayValue = hovered !== null ? hovered : value;

    const getFillPercent = (index: number) => {
        const diff = displayValue - index;
        if (diff >= 1) return 100;
        if (diff > 0) return diff * 100;
        return 0;
    };
    const handleClick = (index: number, e: React.MouseEvent) => {
        if (readOnly || !onChange) return;

        const { left, width } = (e.target as HTMLElement).getBoundingClientRect();
        const clickX = e.clientX - left;

        const isHalf = clickX < width / 2;
        const newRating = isHalf ? index + 0.5 : index + 1;
        onChange(newRating);
    };

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: max }).map((_, i) => {
                const fillPercent = getFillPercent(i);

                return (
                    <div key={i} className={cn("relative", !readOnly && "cursor-pointer", sizeClasses[size])}
                        onMouseEnter={() => !readOnly && setHovered(i + 1)}
                        onMouseLeave={() => !readOnly && setHovered(null)}
                        onClick={(e) => handleClick(i, e)}>
                        {/* Star Outline */}
                        <Star className={cn("absolute text-gray-500", sizeClasses[size])} strokeWidth={1} />

                        {/* Filled Star with mask */}
                        <div className={cn("absolute overflow-hidden", sizeClasses[size])} style={{ width: `${fillPercent}%` }}>
                            <Star className={cn(fillColor, sizeClasses[size])} strokeWidth={1} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StarRating;

import { Progress } from "@/components/ui/progress";

interface SortProgressProps {
    progress: number;
    stepMessages?: string[];
}

export default function SortProgress({ progress, stepMessages = [] }: SortProgressProps) {
    console.log(stepMessages);
    const reversedStepMessages = [...stepMessages].reverse();
    return (
        <div className="w-full space-y-3">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{progress}%</span>
            </div>
            <Progress value={progress} />
            {stepMessages.length > 0 && (
                <ul className="text-xs text-muted-foreground space-y-1 font-mono">
                    {reversedStepMessages.map((msg, i) => (
                        <li
                            key={`${i}-${msg}`}
                            className={i === 0
                                ? "text-foreground font-medium"
                                : "opacity-70"
                            }
                        >
                            {i === 0 && <span className="text-primary mr-1">›</span>}
                            {msg}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

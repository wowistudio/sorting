import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Other() {
    return (
        <div className="flex justify-center items-center h-screen w-full">
            <Button asChild>
                <Link to="/">Home</Link>
            </Button>
        </div>
    );
}
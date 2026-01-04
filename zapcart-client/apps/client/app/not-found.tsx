import Image from "next/image";

export default function NotFound() {
    return (
        <div className=" flex items-center justify-center px-4 ">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-125 md:h-125 lg:w-150 lg:h-150">
                <Image
                    src="/images/404-illustration.png"
                    alt="404 Not Found"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    );
}

import logo from '@/assets/kosice.png';

export const LoadingComponent = () => {
    return (
        <div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center">
            <div className="relative flex items-center justify-center">
                <div className="h-20 w-20 animate-spin rounded-full border-4 border-muted border-t-primary border-b-primary/30" />

                <div className="absolute flex h-full w-full items-center justify-center">
                    <img src={logo} alt="Loading..." className="h-10 w-10 object-contain opacity-90" />
                </div>
            </div>
        </div>
    )
}
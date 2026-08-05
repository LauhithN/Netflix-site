import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";

interface CloudinaryImageProps extends Omit<ImageProps, "src" | "alt"> {
  src: string;
  alt: string;
  wrapperClassName?: string;
}

export function CloudinaryImage({
  src,
  alt,
  className,
  wrapperClassName,
  ...props
}: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={cn("relative overflow-hidden bg-surface", wrapperClassName)}
    >
      {/* ── Error State ────────────────────────────────────────────── */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/40">
          <ImageOff className="h-6 w-6" />
          <span className="text-[10px] uppercase tracking-wider">
            Image Unavailable
          </span>
        </div>
      )}

      {/* ── Shimmer Skeleton ───────────────────────────────────────── */}
      {!hasError && isLoading && (
        <div className="absolute inset-0 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent" />
      )}

      {/* ── Image ──────────────────────────────────────────────────── */}
      {!hasError && (
        <Image
          src={src}
          alt={alt}
          className={cn(
            "transition-opacity duration-500",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          {...props}
          onLoad={(e) => {
            setIsLoading(false);
            if (props.onLoad) props.onLoad(e);
          }}
          onError={(e) => {
            setIsLoading(false);
            setHasError(true);
            if (props.onError) props.onError(e);
          }}
        />
      )}
    </div>
  );
}

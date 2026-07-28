"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import React from "react";
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
    const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )
    return(
        <>
            <div className="w-full flex items-center justify-center my-auto min-h-[640px] h-screen">
                {/* <Carousel
                plugins={[plugin.current]}
                className="w-full max-w-6xl"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                >
                <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                        <Card>
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                            <span className="text-4xl font-semibold">{index + 1}</span>
                            </CardContent>
                        </Card>
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
                </Carousel> */}
                <Image
                src="/images/footer-bg.jpg"
                alt=""
                fill
                className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute text-white text-8xl font-bold">
                    <p>Qui Sommes-Nous ?</p>
                </div>
            </div>
        </>
    )
}
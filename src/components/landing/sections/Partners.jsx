
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';


export function Partners() {
    const partnerLogos = [
        // { src: '/images/partners/paps.png', alt: "Pap's" },
        { src: '/images/partners/ups.png', alt: 'UPS' },
        { src: '/images/partners/axa.png', alt: 'AXA Assurances' },
        { src: '/images/partners/ifan.png', alt: 'IFAN' },
        { src: '/images/partners/microfolie.png', alt: 'Microfolie par la villette' },
        { src: '/images/partners/ambassade.png', alt: 'Ambassade de France' },
        { src: '/images/partners/drouot.jpg', alt: 
            "Maison d'enchères Drouot" },
        { src: '/images/partners/hec.png', alt: 'HEC Paris' },
        { src: '/images/partners/metafrik.png', alt: 'Metafrik' },
        { src: '/images/partners/if.png', alt: 'Institut Français de Dakar' },
        { src: '/images/partners/fanmisefanmi.png', alt: 'Fanmi se Fanmi' },
        { src: '/images/partners/clicdroit.png', alt: 'Clic droit afrique' },
    ];


    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 3 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
    };

    return (
        <section className="w-full py-10 px-2 md:px-0 flex flex-col items-center">
            <h2 className="text-center text-2xl md:text-3xl font-playfair font-semibold mb-6 tracking-tight text-white">Nos partenaires</h2>
            <Carousel
                responsive={responsive}
                infinite
                autoPlay
                autoPlaySpeed={2200}
                arrows={false}
                containerClass="w-full max-w-5xl mx-auto"
                itemClass="flex justify-center items-center"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                draggable
            >
                {partnerLogos.map((logo, idx) => (
                    <div
                        key={idx}
                        className="flex justify-center items-center p-4"
                    >
                        <img
                            src={logo.src}
                            alt={logo.alt}
                            title={logo.alt}
                            className="h-20 w-auto max-w-[120px] grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition duration-300 object-contain rounded-lg shadow-none"
                            loading="lazy"
                        />
                    </div>
                ))}
            </Carousel>
        </section>
    );
}
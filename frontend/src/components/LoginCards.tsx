import  { useEffect, useState, useRef } from 'react';
import { registrationCards } from '../constants/index.ts';

const LoginCards = () => {
    const [currentSlide, setCurrentSlide] = useState(1); // Start at the first real slide
    const [isTransitioning, setIsTransitioning] = useState(true); // Track whether we're in transition

    const sliderRef = useRef(null);

    // Clone the first and last slide
    const firstSlideClone = registrationCards[0];
    const lastSlideClone = registrationCards[registrationCards.length - 1];

    // Total slides (including clones)
    const totalSlides = registrationCards.length + 2; // 2 clones (first and last)

    // Set the transform to move the slider
    const getTransform = () => {
        return `translateX(-${currentSlide * 100}%)`;
    };

    // Auto-slide effect
    useEffect(() => {
        const interval = setInterval(() => {
            changeSlide();
        }, 1000);
        return () => clearInterval(interval);

    }, [currentSlide]);

    const changeSlide = () => {

        setIsTransitioning(true); // Enable smooth transition
        setCurrentSlide((prevSlide) => {
            if (prevSlide + 1 >= 5)
                return 1;
            else return prevSlide + 1
        });
    };

    const handleTransitionEnd = () => {
        // Disable transition momentarily when jumping back to real slides
        if (currentSlide === totalSlides - 1) {
            setIsTransitioning(false); // Disable transition
            setCurrentSlide(1); // Jump to the real first slide
        } else if (currentSlide === 0) {
            setIsTransitioning(false); // Disable transition
            setCurrentSlide(totalSlides - 2); // Jump to the real last slide
        }
    };


    return (
        <section className='slider relative p-11 w-[47%] h-[95%] m-4 shadow-lg bg-slate-200 rounded-xl flex center flex-col '>
            <div
                className='overflow-hidden flex w-full  h-full'
            >
                <div
                    className='slider-wrapper flex  transition-transform duration-500 ease-in-out'
                    ref={sliderRef}
                    style={{
                        transform: getTransform(),
                        transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none'
                    }}
                    onTransitionEnd={handleTransitionEnd}
                >

                    {/* Last slide clone (placed first) */}
                    <div className='slide flex flex-col center flex-shrink-0 w-full'>
                        <img src={lastSlideClone.imgURL} draggable='false' alt="" className='mb-10 h-[400px] w-[400px]' />
                        <h1 className='text-4xl font-extrabold  font-alata text-blue-3 '>Go completely paperless</h1>
                        <p className='text-lg  mt-5 text-center text-black' >Edit, sign, collaborate on, and store your documents online. Eliminate those depressing piles of paper with pdfFiller.</p>
                    </div>


                    {/* Actual slides */}
                    {registrationCards.map((data, index) => (
                        <>
                            <div key={index} className='slide flex flex-col center flex-shrink-0 w-[100%] '>
                                <img src={data.imgURL} draggable='false' alt="" className='mb-10 h-[400px] w-[400px]' />
                                <h1 className='text-4xl font-extrabold  font-alata text-blue-3 '>{data.heading}</h1>
                                <p className='text-lg  mt-5 text-center text-black' >{data.description}</p>

                            </div>
                        </>
                    ))}

                    {/* First slide clone (placed last) */}
                    <div className='slide flex flex-col center flex-shrink-0 w-full'>
                        <img src={firstSlideClone.imgURL} draggable='false' alt="" className='mb-10 h-[400px] w-[400px]' />
                        <h1 className='text-4xl font-extrabold  font-alata text-blue-3 '>Secure your documents</h1>
                        <p className='text-lg  mt-5 text-center text-black' >With encrypted folders, bank-level security and privacy measures, no one can access your documents except you.</p>

                    </div>

                </div>
            </div>
        </section>
    );
}

export default LoginCards;



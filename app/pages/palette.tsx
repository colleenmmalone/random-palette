import { useEffect, useState } from "react";
import { usePalette } from '../utils/use-palette'
import { colorSelect } from "~/utils/types";
import { GradientsMap } from "~/components/GradientsMap";
import SectionHeader from "~/components/SectionHeader";
import Divider from "~/components/Divider";

// import exclude from "./exclude.svg";
// import frame22 from "./frame-22.svg";
// import image from "./image.svg";
// import rectangle11 from "./rectangle-11.svg";
import house from "../assets/house.svg";
import shield from "../assets/shield.svg";
import form from "../assets/form.svg";
import logo from "../assets/logo.svg";
import brand from "../assets/brand.svg";
import Logo from "~/components/Logo";

interface FeatureCard {
    id: number;
    icon: JSX.Element;
    title: string;
    description: string;
}

export const Palette: React.FC = () => {

    const {
        randomColor,
        colorFamily,
        data,
        setRandomColor,
        setColorFamily,
        setData,
    } = usePalette();

    const [isGenerated, setIsGenerated] = useState(false);
    const [primary, setPrimary] = useState('');
    const [secondary, setSecondary] = useState('');
    const [tertiary, setTertiary] = useState('');
    const [pGradient, setPGradient] = useState<string[]>([]);
    const [sGradient, setSGradient] = useState<string[]>([]);
    const [tGradient, setTGradient] = useState<string[]>([]);
    const [palette, setPalette] = useState<Palette>();


    interface Palette {
        primary: string,
        secondary: string,
        tertiary: string,
        foreground: string,
        background: string,
        border: string,
        cta: string,
        gradients: string[][],
    }



    /*
    HSL
    hue: 0 - 360 (what color?)
    saturation: 0-100 (vibrancy)
    lightness: 0-100 ()
    
    */
    // fetch random color on load 
    useEffect(() => {
        fetchRandomColor(colorFamily || '');
    }, []);

    // fetch color via api 
    async function fetchRandomColor(colorFamily = '') {
        try {
            const url = `https://x-colors.yurace.pro/api/random/${colorFamily}`;
            const response = await fetch(url);
            const data = await response.json();
            setRandomColor(data.hex)
            setData(data);
        } catch (error) {
            console.error('Error fetching color:', error);
        }
    }

    function findPalette(hslStr: string) {
        setIsGenerated(true);
        const parsedHSL = hslStr.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (!parsedHSL) return null; // Or throw an error
        const pH = +parsedHSL[1]
        var sH = 0
        var tH = 0

        if (pH < 120) {
            sH = pH + 240
            tH = pH + 120
        } else if (pH > 240) {
            sH = pH - 120
            tH = pH - 240
        } else {
            sH = pH - 120
            tH = pH + 120
        }



        // set the primary colors 
        setPrimary(hslStr)
        setSecondary(`hsl(${sH}, ${parsedHSL[2]}%, ${parsedHSL[3]}%)`)
        setTertiary(`hsl(${tH}, ${parsedHSL[2]}%, ${parsedHSL[3]}%)`)

        // set gradients 
        handleCreateGradient(setPGradient, pH.toString(), parsedHSL[2]);
        handleCreateGradient(setSGradient, sH.toString(), parsedHSL[2]);
        handleCreateGradient(setTGradient, tH.toString(), parsedHSL[2]);
    };

    function handleCreateGradient(setGradient: React.Dispatch<React.SetStateAction<string[]>>, h: string, s: string): void {
        const arr: string[] = [];
        for (let i = 10; i <= 95; i += 17) {
            arr.push(`hsl(${h}, ${s}%, ${i}%)`);
        }
        setGradient(arr)
    }

    // useEffect is the workaround for gradients not being saved on first onClick 
    useEffect(() => {
        setPalette({
            primary: primary,
            secondary: secondary,
            tertiary: tertiary,
            foreground: pGradient[0],
            background: pGradient[5],
            border: pGradient[4],
            cta: pGradient[2],
            gradients: [pGradient, sGradient, tGradient]
        })
    }, [pGradient, sGradient, tGradient]);

    // Source - https://stackoverflow.com/a/76922730
    // Posted by Arnab_Ghosh
    // Retrieved 2026-02-27, License - CC BY-SA 4.0

    const DownloadButton = () => {
        const file = new Blob([JSON.stringify(palette)], { type: 'json' });

        return (
            <button
                className="bg-black text-white rounded px-4 py-2 active:opacity-80"
            >
                <a download={`my-palette-${data?.hex || 'json'}.json`} target="_blank" rel="noreferrer" href={URL.createObjectURL(file)} style={{
                    textDecoration: "inherit",
                    color: "inherit",
                }}>
                    Export Palette
                </a>
            </button>
        )
    }

    const featureCards: FeatureCard[] = [
        {
            id: 1,
            icon: (
                <img
                    className="w-[49.35px] h-[43.21px]"
                    alt="house icon"
                    src={house}
                />
            ),
            title: "Home",
            description:
                "There's some text down here that I don't feel like making up.",
        },
        {
            id: 2,
            icon: (
                <img
                    className="w-[38px] h-[49px]"
                    alt="shield icon"
                    src={shield}
                />
            ),
            title: "Security",
            description:
                "There's some text down here that I don't feel like making up.",
        },
        {
            id: 3,
            icon: (
                <img
                    className="w-[49.35px] h-[43.21px]"
                    alt="form icon"
                    src={form}
                />
            ),
            title: "Integrity",
            description:
                "There's some text down here that I don't feel like making up.",
        },
    ];


    return (
        <div className="h-full w-full min-h-screen bg-white flex flex-col items-center justify-center text-md gap-5">
            <div className={`absolute w-full h-80 top-0 left-0 bg-black z-0`}
                style={{ backgroundColor: randomColor || 'transparent' }}
            />
            {/* header  */}
            <header className="absolute flex w-70 sm:w-80 items-center justify-center gap-2.5 px-4 py-2.5  top-0  bg-[#fffbec] rounded-[0px_0px_8px_8px] border border-solid border-[#b69f8a]">
                <h1 className=" w-fit font-bold text-black text-lg tracking-[0] leading-[normal]">
                    Random Palette Generator
                </h1>
            </header>

            {/* content wrapper  */}
            <div className="flex flex-col gap-[20px] px-[30px] pt-20 w-full h-full min-h-screen max-w-[430px] z-10 mx-auto justify-center items-center">

                <div className="mt-30 flex flex-col gap-7.5 py-10 px-6  mx-auto w-70 sm:w-80 justify-center items-center bg-[#fffbec] rounded-[20px] border border-solid border-[#b69e8a]" >

                    <select id="colorFamilySelect"

                        className="border px-4 py-2"
                        value={colorFamily}
                        onChange={(e) => setColorFamily(e.target.value)}
                    >
                        <option value="">All Colors</option>
                        {colorSelect.map((c) => {

                            return (<option key={c} value={c}>{c}</option>)
                        })}
                    </select>
                    <button
                        className="bg-black text-white rounded px-4 py-2"
                        onClick={() => fetchRandomColor(colorFamily)}
                    >
                        Get Random Color
                    </button>
                    <div className="max-w-75">

                        <p className="flex gap-3">
                            <span className="w-10 text-right">Hex:</span>
                            <span className="text-right">{data?.hex}</span>
                        </p>
                        <p className="flex gap-3">
                            <span className="w-10 text-right">RGB:</span>
                            <span className="text-right">{data?.rgb}</span>
                        </p>
                        <p className="flex gap-3">
                            <span className="w-10 text-right">HSL:</span>
                            <span className="text-right">{data?.hsl}</span>
                        </p>
                    </div>
                </div>



                {data
                    ?
                    <div className="flex flex-col items-center justify-center gap-2">
                        <p>Like what you see?</p>
                        <button
                            className="bg-black text-white rounded px-4 py-2"
                            onClick={() => findPalette(data.hsl)}
                        >
                            Generate Palette
                        </button>
                    </div>
                    :
                    <></>
                }

                {isGenerated && palette
                    ?
                    <>
                        <Divider />

                        <SectionHeader>
                            Your Main Characters
                        </SectionHeader>


                        <div className="flex w-full gap-4 sm:gap-6">

                            <div className="flex flex-col w-full border rounded overflow-hidden">
                                <div className={`w-full h-[90px]`}
                                    style={{ backgroundColor: primary || 'transparent' }}
                                />
                                <p className="w-full py-2 text-center font-light">
                                    Primary
                                </p>
                            </div>

                            <div className="flex flex-col w-full border rounded overflow-hidden">
                                <div className={`w-full h-[90px]`}
                                    style={{ backgroundColor: secondary || 'transparent' }}
                                />
                                <p className="w-full py-2 text-center font-light">
                                    Secondary
                                </p>
                            </div>

                            <div className="flex flex-col w-full border rounded overflow-hidden">
                                <div className={`w-full h-[90px]`}
                                    style={{ backgroundColor: tertiary || 'transparent' }}
                                />
                                <p className="w-full py-2 text-center font-light">
                                    Tertiary
                                </p>
                            </div>

                        </div>

                        <Divider />

                        <SectionHeader>
                            Your Supporting Cast
                        </SectionHeader>


                        <div className="flex gap-2 w-full">

                            {palette.gradients[0].map((g, i) => {
                                return (
                                    <div
                                        key={'gradient-' + i}
                                        className="flex-1 h-22.5 rounded-md"
                                        style={{ backgroundColor: g || 'transparent' }}
                                    />
                                )
                            })}
                        </div>
                        <div className="flex gap-2 w-full">
                            {palette.gradients[1].map((g, i) => {
                                return (
                                    <div
                                        key={'gradient-' + i}
                                        className="flex-1 h-22.5 rounded-md"
                                        style={{ backgroundColor: g || 'transparent' }}
                                    />
                                )
                            })}
                        </div>
                        <div className="flex gap-2 w-full">
                            {palette.gradients[2].map((g, i) => {
                                return (
                                    <div
                                        key={'gradient-' + i}
                                        className="flex-1 h-22.5 rounded-md"
                                        style={{ backgroundColor: g || 'transparent' }}
                                    />
                                )
                            })}


                        </div>

                        <Divider />

                        <SectionHeader>
                            Your Typography
                        </SectionHeader>

                        <div className={`flex flex-col w-[370px] gap-3 p-[30px] rounded-[20px] border`}
                            style={{ color: palette.foreground, backgroundColor: palette.background, borderColor: palette.border }}
                        >
                            <h3 className="font-bold text-lg tracking-[0] leading-[normal]">
                                This is what your text looks like
                            </h3>
                            <p className="text-base tracking-[0] leading-[normal]">
                                If you were to have a block of text in light mode, it would look
                                something like this. Dark text on a pale background with just enough
                                of a hint of color from your primary hue.
                            </p>
                        </div>
                        <div className={`flex flex-col w-[370px] gap-3 p-[30px] rounded-[20px]`}
                            style={{ color: palette.background, backgroundColor: palette.foreground }}
                        >
                            <h3 className="font-bold text-lg tracking-[0] leading-[normal]">
                                And here is how it looks
                            </h3>
                            <p className="text-base tracking-[0] leading-[normal]">
                                in dark mode. This is for the edgy types. Or developers. Nobody
                                likes to code on a bright, white screen. Or it&apos;s useful to draw
                                attention to a particular bock of text.
                            </p>
                        </div>



                        <Divider />

                        <SectionHeader>
                            Your Calls to Action
                        </SectionHeader>
                        {isGenerated && palette
                            ?
                            <>

                                <button
                                    className="flex w-60 items-center justify-center p-2.5 rounded cursor-pointer hover:opacity-90 transition-opacity"
                                    style={{ color: 'white', backgroundColor: palette.cta }}
                                    aria-label="Default button"
                                >
                                    <span className=" w-[68px] font-semibold text-white text-lg text-center tracking-[0] leading-[normal]">
                                        Default
                                    </span>
                                </button>

                                <button
                                    className="flex w-60 items-center justify-center p-2.5 rounded border border-solid cursor-pointer bg-opacity-0"

                                    style={{ color: palette.cta, backgroundColor: 'white', borderColor: palette.cta }}
                                    aria-label="Outline button"
                                >
                                    <span className=" w-fit font-semibold text-lg text-center tracking-[0] leading-[normal]">
                                        Outline
                                    </span>
                                </button>

                                <button
                                    className="flex w-60 items-center justify-center p-2.5 rounded border border-solid cursor-not-allowed"
                                    style={{ color: palette?.gradients[0][3], backgroundColor: palette?.gradients[0][5], borderColor: palette?.gradients[0][4] }}
                                    aria-label="Disabled button"
                                    disabled
                                >
                                    <span className=" w-fit font-semibold text-lg text-center tracking-[0] leading-[normal]">
                                        Disabled
                                    </span>
                                </button>

                                <button
                                    className="flex w-60 items-center justify-center p-2.5 rounded cursor-pointer hover:underline"
                                    style={{ color: palette.cta, backgroundColor: 'transparent' }}
                                    aria-label="Ghost button"
                                >
                                    <span className=" w-fit  font-semibold text-lg text-center tracking-[0] leading-[normal]">
                                        Ghost
                                    </span>
                                </button>


                            </>
                            :
                            <></>
                        }


                        <Divider />

                        <SectionHeader>
                            Your Landing Page
                        </SectionHeader>

                        {isGenerated && palette
                            ?
                            <>

                                <div className="flex flex-col w-[363px] h-[634px] items-start bg-white rounded-[40px] overflow-hidden border-8 border-solid border-black">

                                    <header className="flex w-full h-[69px] rounded-[40px,40px,0,0] items-center justify-between px-[30px] py-[10px] ">
                                        <div className="flex gap-2">
                                            <Logo className="h-[40px] w-[56px]" primary={palette.gradients[0][2]} secondary={palette.gradients[1][2]} tertiary={palette.gradients[2][2]} />
                                            <img
                                                className=" flex-[0_0_auto]"
                                                alt="Cozy Homes Real Estate brand name"
                                                src={brand}
                                            />
                                        </div>


                                        <nav>
                                            <div className=" font-normal text-[#b83177] text-base tracking-[0] leading-[normal]"
                                                style={{ color: palette.cta }}
                                            >
                                                Home
                                            </div>
                                        </nav>
                                    </header>

                                    <section className="flex flex-col w-full h-[268px] items-center justify-center gap-2.5 p-[30px]"
                                        style={{ backgroundImage: `linear-gradient(to bottom right, ${palette.primary}, ${palette.secondary}, ${palette.tertiary}, ${palette.primary} )` }}
                                    >
                                        <div className="flex flex-col items-center justify-center gap-[19px] px-[30px] py-[15px] flex-1 self-stretch w-full grow bg-[#ffffffc0] rounded-[20px] backdrop-blur-[10px] backdrop-brightness-100% [-webkit-backdrop-filter:blur(10px)_brightness(100%)]">
                                            <div className=" w-[74.77px] h-[53px]" aria-hidden="true">
                                                <Logo primary={palette.gradients[0][2]} secondary={palette.gradients[1][2]} tertiary={palette.gradients[2][2]} />
                                            </div>

                                            <h1 className="w-fit font-semibold text-black text-lg text-center tracking-[0] leading-[normal]">
                                                Ready to buy a home?
                                            </h1>

                                            <button
                                                className="flex w-[185.49px] h-[34px] items-center justify-center 5 p-2.5 rounded cursor-pointer hover:opacity-80 transition-opacity "
                                                style={{ backgroundColor: palette.cta }}
                                                aria-label="Hire us to help you buy a home"
                                            >
                                                <span className="font-semibold text-white text-lg text-center tracking-[0] leading-[normal]">
                                                    Hire Us
                                                </span>
                                            </button>
                                        </div>
                                    </section>

                                    <section className="flex items-center px-[30px] py-5"
                                        style={{ color: palette.foreground }}
                                    >
                                        <p className=" font-norma text-base tracking-[0] leading-[normal]">
                                            We get it. Househunting is a stressful process, but we are here to
                                            help. Any one of our friendly associates would be happy to help you
                                            buy our sell your home. It all starts with a phone call!
                                        </p>
                                    </section>

                                    <section className="flex w-full h-[162px] items-start justify-between px-5 py-[30px] rounded-[0px_0px_40px_40px]"
                                        style={{ backgroundColor: palette.background }}
                                    >
                                        {featureCards.map((feature) => (
                                            <article
                                                key={feature.id}
                                                className="flex flex-col items-center justify-center gap-1 px-2.5 py-0 flex-1"
                                            >
                                                <div className="flex w-[70px] h-[70px] items-center justify-center rounded-[10px]"
                                                    style={{ backgroundColor: palette.gradients[2][2] }}
                                                >
                                                    {feature.icon}
                                                </div>

                                                <h2 className=" w-fit  font-bold text-black text-xl text-center tracking-[0] leading-[normal] whitespace-nowrap">
                                                    {feature.title}
                                                </h2>

                                                <p className=" self-stretch font-normal text-black text-xs text-center tracking-[0] leading-[normal]">
                                                    {feature.description}
                                                </p>
                                            </article>
                                        ))}
                                    </section>
                                </div>
                            </>
                            :
                            <></>
                        }


                        <Divider />
                        <div className="flex flex-col my-16 items-center justify-center gap-4">
                            <p>Do you love it?</p>
                            <DownloadButton />
                            <p>Don't forget to take a screenshot and share!</p>
                        </div>

                    </>
                    :
                    <></>
                }

                    <footer className="flex w-70 sm:w-80 mt-auto mb-0 items-center justify-center gap-2.5 px-4 py-2.5 bg-amber-50 rounded-[8px_8px_0px_0px] border border-solid border-[#b69f8a]">
                        <p className=" w-fit font-bold text-black text-lg tracking-[0] leading-[normal]">
                            Made by Colleen
                        </p>
                    </footer>
            </div >
        </div>
    )
}

export default Palette
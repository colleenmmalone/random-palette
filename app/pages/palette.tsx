import { useEffect, useState } from "react";
import { usePalette } from '../utils/use-palette'
import { colorSelect } from "~/utils/types";


export const Palette: React.FC = () => {

    const {
        randomColor,
        colorFamily,
        data,
        setRandomColor,
        setColorFamily,
        setData,
    } = usePalette();

    const [primary, setPrimary] = useState('');
    const [secondary, setSecondary] = useState('');
    const [tertiary, setTertiary] = useState('');
    const [gradients, setGradients] = useState<string[]>([]);
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
        const parsedHSL = hslStr.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (!parsedHSL) return null; // Or throw an error
        const pS = +parsedHSL[1]
        var sS = 0
        var tS = 0

        // check if hue is out of bounds 0-360 
        if (pS - 120 < 0) {
            sS = 240 + pS
            tS = 120 + pS
        } else if (120 + pS > 360) {
            sS = pS - 120
            tS = pS - 240
        } else {
            sS = pS - 120
            tS = pS + 120
        }
        // set the primary colors 
        setPrimary(hslStr)
        setSecondary(`hsl(${sS}, ${parsedHSL[2]}%, ${parsedHSL[3]}%)`)
        setTertiary(`hsl(${tS}, ${parsedHSL[2]}%, ${parsedHSL[3]}%)`)

        // set the gradients
        const arr: string[] = [];

        for (let i = 10; i <= 95; i += 17) {
            arr.push(`hsl(${pS}, ${parsedHSL[2]}%, ${i}%)`);
            console.log(arr)
        }

        setGradients(arr);
    };


    return (
        <div className="h-full w-full min-h-screen overflow-y-scroll overflow-x-hidden flex flex-col items-center justify-center text-md font-bold gap-5">

            <div className="w-75 h-50  border-amber-200 border rounded-lg"
                style={{ backgroundColor: randomColor || 'transparent' }}
            />

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
                className="border px-4 py-2"
                onClick={() => fetchRandomColor(colorFamily)}
            >
                Get Random Color {colorFamily}
            </button>
            {data ?
                <>
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
                    <div className="flex gap-10">
                        <div className="flex flex-col justify-center items-center gap-2">
                            primary
                            <div className={`h-10 w-10 border-amber-200 border`}
                                style={{ backgroundColor: primary || 'transparent' }}
                            />
                        </div>

                        <div className="flex flex-col justify-center items-center gap-2">
                            secondary
                            <div className={`h-10 w-10 border-amber-200 border`}
                                style={{ backgroundColor: secondary || 'transparent' }}
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center gap-2">
                            tertiary
                            <div className={`h-10 w-10 border-amber-200 border`}
                                style={{ backgroundColor: tertiary || 'transparent' }}
                            />
                        </div></div>
            {gradients ?
                <div className="flex gap-1 w-full">
                    {gradients.map((g, i) => {
                        return (
                            <div
                                key={i}
                                className="flex-1 h-20 border border-amber-200"
                                style={{ backgroundColor: g || 'transparent' }}
                            />
                        )
                    })
                    }
                </div>
                :
                <></>
            }

            {gradients
                ?

                        <div className="flex gap-10">
                    <div
                        className="px-4 py-2 rounded-lg border"
                        style={{
                            backgroundColor: gradients[5] || 'transparent',
                            color: gradients[1],
                            borderColor: gradients[2],
                        }}
                    >
                        Light Mode
                    </div>

                    <div
                        className="px-4 py-2 rounded-lg "
                        style={{
                            backgroundColor: gradients[0] || 'transparent',
                            color: gradients[5]
                        }}
                    >
                        Dark Mode
                    </div>


                    <div
                        className="px-4 py-2 rounded-lg text-white hover:opacity-90"
                        style={{
                            backgroundColor: gradients[2] || 'transparent',
                        }}
                    >
                        Primary CTA
                    </div>

                </div>
                :
                <></>
            }


            <button
                className="border px-4 py-2"
                onClick={() => findPalette(data.hsl)}
            >
                find complementary colors
            </button>
        </> :
    <></>
}

        </div >
    )
}

export default Palette
import { useState, useEffect, useRef } from "react"
import { Input, Space } from 'antd';

const Student = () => {
    const [exercise, setExercise] = useState([]);
    const [currentExercise, setCurrentExercise] = useState(0);
    const [point, setPoint] = useState(0);
    const [answer, setAnswer] = useState("");
    const [truefalse, setTrueFalse] = useState(0);
    const [isShowAnswer, setIsShowAnswer] = useState(false);
    const inputRef = useRef();
    useEffect(() => {
        console.log(1);
        fetch("http://localhost:8080/exercise")
            .then(res => res.json()).then((res) => {
                const nrs = res.map(item => {
                    return {
                        ...item,
                        formatted: convertWord(item.word)
                    }
                })
                setExercise(nrs)
            }).catch((e) => { console.log(e); })
    }, [])

    function convertWord(word) {
        if (word.length < 5) {
            let index = Math.floor(Math.random() * word.length);
            return word.slice(0, index) + '_' + word.slice(index + 1);
        } else if (word.length >= 5 && word.length < 10) {
            let index1 = Math.floor(Math.random() * (word.length - 1)) + 1;
            let index2 = Math.floor(Math.random() * (word.length - 1)) + 1;

            while (index2 === index1) {
                index2 = Math.floor(Math.random() * (word.length - 1)) + 1;
            }

            let start = Math.min(index1, index2);
            let end = Math.max(index1, index2);

            return (
                word.slice(0, start) + '_' + word.slice(start + 1, end) + '_' + word.slice(end + 1)
            );
        } else {
            let indices = [];
            let maxAttempts = 100;
            let attempts = 0;

            while (indices.length < 3 && attempts < maxAttempts) {
                let index = Math.floor(Math.random() * (word.length - 1)) + 1;
                if (!indices.includes(index)) {
                    indices.push(index);
                }
                attempts++;
            }

            if (attempts === maxAttempts) {
                console.error("Failed to find suitable positions for '_'.");
                return word;
            }

            indices.sort((a, b) => a - b);
            let result = word.slice(0, indices[0]) + '_';
            for (let i = 0; i < 2; i++) {
                result += word.slice(indices[i] + 1, indices[i + 1]) + '_';
            }
            result += word.slice(indices[2] + 1);
            return result;
        }
    }

    return <div className="flex items-center justify-center gap-[10px] w-full min-h-screen bg-[rgba(0,0,0,.06)]">
        <div className="px-[20px] py-[10px] bg-white rounded-[12px] flex flex-col items-center">
            <p>
                {exercise.length > 0 &&
                    exercise[currentExercise].formatted
                }
            </p>

            <input type="text" style={{ border: `1px solid ${truefalse === false ? "#ff9595" : truefalse === 0 ? "#d9d9d9" : "#adff7d"} ` }} ref={inputRef} className="mt-[6px] rounded-[6px] outline-none pl-[4px] py-[4px]" />

            {isShowAnswer && <div className="flex justify-center mt-[5px]">
                <p className="mr-[3px]">
                    {exercise.length > 0 &&
                        exercise[currentExercise].word
                    }
                </p>(
                <p className="mr-[3px]">
                    {exercise.length > 0 &&
                        exercise[currentExercise].ipa
                    }
                </p>):
                <p className="ml-[3px]">
                    {exercise.length > 0 &&
                        exercise[currentExercise].wordVi
                    }
                </p>
            </div>}
            {!isShowAnswer && <div className="bg-[#0583d2] inline-block px-[10px] py-[4px] mt-[10px] rounded-[10px] text-white text-[14px] font-[500 ] active:translate-y-[5px] transition-all ease-linear"
                onClick={() => {
                    if (inputRef.current.value.trim().toLowerCase() === exercise[currentExercise].word.toLowerCase()) {
                        setPoint(prev => prev + 1);
                        setTrueFalse(true);
                    } else setTrueFalse(false);
                    setIsShowAnswer(true);
                }}>
                <p>Submit</p>
            </div>}
            {isShowAnswer && <div className="bg-[#0583d2] inline-block px-[10px] py-[4px] mt-[10px] rounded-[10px] text-white text-[14px] font-[500 ] active:translate-y-[5px] transition-all ease-linear"
                onClick={() => {
                    if (currentExercise < exercise.length)
                        setCurrentExercise(prev => prev + 1);
                    setIsShowAnswer(false);
                    setTrueFalse(0);
                    inputRef.current.value = "";
                }}>
                <p>Next</p>
            </div>}
        </div>

        <div className="px-[10px] py-[5px] bg-white rounded-[12px]">{point}/{exercise.length}</div>
    </div>
}

export default Student;
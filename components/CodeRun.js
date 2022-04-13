import { cpp } from "@codemirror/lang-cpp"
import CodeMirror from "@uiw/react-codemirror"
import { useEffect, useState } from "react"
import { executeCode } from "../lib/execute"
import { Play } from "phosphor-react"

export default function CodeRun () {
  const [code, setCode] = useState()
  const [output, setOutput] = useState()
  // Placeholder code on CodeMirror load.
  const codeStub = '#include <stdio.h>\n\nint main(void)\n{\n    printf("Hello World");\n\n    return 0;\n}'

  const buttonClass = [
    "flex flex-row items-center h-full gap-2 px-4 text-white transition-all bg-emerald-600 hover:bg-emerald-500",
    "flex flex-row items-center h-full gap-2 px-4 text-white transition-all bg-gray-600 text-gray-400 cursor-not-allowed"
  ]
  const iconClass = ["fill-white transition-all", "fill-gray-400 transition-all"]

  // Set code to placeholder on load.
  useEffect(() => {
    setCode(codeStub)
  }, [])

  // Disable button if code editor empty
  useEffect(() => {
    if (!code) {
      document.getElementById("runcode-button").setAttribute("class", buttonClass[1])
      document.getElementById("runcode-icon-play").setAttribute("class", iconClass[1])
      document.getElementById("runcode-button").onclick = null
    } else {
      document.getElementById("runcode-button").setAttribute("class", buttonClass[0])
      document.getElementById("runcode-icon-play").setAttribute("class", iconClass[0])
      document.getElementById("runcode-button").onclick = () => {
        getOutput()
      }
    }
  }, [code])

  async function getOutput () {
    const res = await executeCode(code)
    // Decode stdin from base64 to plain text string
    const output = window.atob(res.stdout)
    setOutput(output)
  }

  return (
    <div className='flex flex-col'>
      <div className='h-12 w-[1000px] bg-black grid grid-cols-2'>
        <div className='flex flex-row items-center justify-between pl-5'>
          <span className='font-medium text-white'>Code</span>
          <button id='runcode-button' className={buttonClass[0]}>
            <Play weight='fill' className='fill-white' id='runcode-icon-play' />
            Run
          </button>
        </div>
        <div className='flex flex-row items-center justify-end pr-5'>
          <span className='font-medium text-white'>Output</span>
        </div>
      </div>
      <div className='flex flex-row'>
        <CodeMirror
          value={codeStub}
          width='500px'
          height='500px'
          theme='dark'
          extensions={[cpp({ cpp: true })]}
          onChange={input => {
            setCode(input)
          }}
        />
        <div className='w-1/2 p-4 font-mono text-white bg-slate-900'>{output}</div>
      </div>
      <div className='w-full h-12 p-4 bg-black' />
    </div>
  )
}

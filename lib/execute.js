// TODO: Find out why process env isn't working
const apiHost = process.env.RAPIDAPI_HOST
const apiKey = process.env.RAPIDAPI_KEY

export const executeCode = async code => {
  // Encode code in base64
  console.log(code)
  const data = window.btoa(code)

  const createSubmissionOptions = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Content-Type": "application/json",
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      "X-RapidAPI-Key": "7ca37f8d89msh931e041327f0affp1473c9jsn4c4b0c974bc2"
    },
    body: `{"language_id":52,"source_code":"${data}"}`
  }

  const createSubmission = await fetch(
    "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*",
    createSubmissionOptions
  )
    .then(res => res.json())
    .catch(err => console.error(err))

  const getSubmissionOptions = {
    method: "GET",
    headers: {
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      "X-RapidAPI-Key": "7ca37f8d89msh931e041327f0affp1473c9jsn4c4b0c974bc2"
    }
  }

  const getSubmission = await fetch(
    `https://judge0-ce.p.rapidapi.com/submissions/${createSubmission.token}?base64_encoded=true&fields=*`,
    getSubmissionOptions
  )
    .then(res => res.json())
    .catch(err => console.error(err))

  // TODO: Error catching if fetch returns null object (i.e. limit hit)
  while (getSubmission.status.id != 3) {
    getSubmission = await fetch(
      `https://judge0-ce.p.rapidapi.com/submissions/${createSubmission.token}?base64_encoded=true&fields=*`,
      getSubmissionOptions
    )
      .then(res => res.json())
      .catch(err => console.error(err))

    // Compilation error
    if (getSubmission.status.id == 6) {
      const message = window.btoa("Compilation error")
      return { stdout: message }
    }

    console.log(getSubmission)
  }

  return getSubmission
}

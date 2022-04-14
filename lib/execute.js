// TODO: Find out why process env isn't working

export const executeCode = async code => {
  // Encode code in base64
  console.log(code)
  const data = window.btoa(code)

  const createSubmissionOptions = {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: `{"language_id":52,"source_code":"${data}"}`
  }

  const createSubmission = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/submissions?base64_encoded=true&wait=false&fields=*`,
    createSubmissionOptions
  )
    .then(res => res.json())
    .catch(err => console.error(err))

  const getSubmissionOptions = {
    method: "GET"
  }

  const getSubmission = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/submissions/${createSubmission.token}?base64_encoded=true&fields=*`,
    getSubmissionOptions
  )
    .then(res => res.json())
    .catch(err => console.error(err))

  // TODO: Error catching if fetch returns null object (i.e. limit hit)
  while (getSubmission.status.id != 3) {
    getSubmission = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/submissions/${createSubmission.token}?base64_encoded=true&fields=*`,
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

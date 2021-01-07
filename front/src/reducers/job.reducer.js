// eslint-disable-next-line
export default function (job = "", action) {
    if (action.type === "saveJob") {
      return action.job;
    } else {
      return job;
    }
  }
  
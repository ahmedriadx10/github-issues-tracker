const issuesCardContainer = elementTaker("issues-card-container");
const loadingSpinner = elementTaker("spinner-container");
const issuesCount = elementTaker("issues-count");
const tabButtonsContainer = elementTaker("tab-buttons-container");
const userSearchInput = elementTaker("user-search-input");
const searchBtn = elementTaker("search-issues-btn");

let issuesData = [];

async function getAllIssues() {
  const dataGet = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );
  const convData = await dataGet.json();

  const { data } = convData;

  issuesData = data;
  renderIssuesUI(data);
}

function setPriorityBatch(priority) {
  let priorityBatch = "";
  switch (priority) {
    case "high":
      priorityBatch = `<div class="badge badge-soft badge-error uppercase font-medium">${priority}</div>`;
      break;
    case "medium":
      priorityBatch = `<div class="badge badge-soft badge-warning uppercase font-medium">${priority}</div>`;

      break;
    case "low":
      priorityBatch = `<div class="badge badge-soft badge-neutral/30 text-neutral/30 uppercase font-medium">${priority}</div>`;
      break;

    default:
      priorityBatch = `<div class="badge badge-soft badge-neutral/30 text-neutral/30 uppercase font-medium">${"Unknown"}</div>`;
  }

  return priorityBatch;
}

function labelsSet(labels) {
  const labelsCreate = labels.map((x) => {
    if (x === "bug") {
      return `  <div class=" rounded-full badge badge-soft badge-error uppercase font-medium"><i class="fa-solid fa-bug"></i> ${x}</div>`;
    } else if (x === "help wanted") {
      return `  <div class="rounded-full badge badge-soft badge-warning uppercase font-medium"><i class="fa-solid fa-life-ring"></i> ${x}</div>`;
    } else if (x === "enhancement") {
      return `  <div class="rounded-full badge badge-soft badge-success uppercase font-medium"><img src='./assets/Vector.png'> ${x}</div>`;
    } else if (x === "documentation") {
      return `  <div class="rounded-full badge badge-soft badge-primary uppercase font-medium"><i class="fa-solid fa-file"></i> ${x}</div>`;
    } else if (x === "good first issue") {
      return `  <div class="rounded-full badge badge-soft badge-info uppercase font-medium"><i class="fa-solid fa-thumbs-up"></i> ${x}</div>`;
    }
  });

  const allLabels = labelsCreate.join(" ");
  return allLabels;
}

function renderIssuesUI(getData) {
  issuesCardContainer.innerHTML = "";

  getData.forEach((x) => {
    const {
      id,
      title,
      description,
      status,
      labels,
      priority,
      author,
      createdAt,
    } = x;

    const issueCard = document.createElement("div");

    issueCard.innerHTML = `
  
  <div data-id='${id}' class="card bg-base-100 shadow-lg rounded-md    border-t-4 ${status === "open" ? "border-success" : "border-[#A855F7]"} w-full h-full">

<!-- card content -->
 <div class="p-4">  <!-- status and priority area -->
<div class="flex justify-between items-center">
  ${status === "open" ? '<img src="./assets/open-status.png" alt="">' : '<img src="./assets/close-status.png" alt="">'}
<div>${setPriorityBatch(priority)}</div>
</div>

<!-- card body area -->
 <div class="mt-3"><h4 class="font-semibold text-neutral">${title}</h4>
<p class="mt-2 text-[#64748B]">${description}</p>
<!-- labels area  -->

<div class="flex flex-wrap gap-y-2 gap-1.5  py-4 ">
  ${labelsSet(labels)}
</div>


</div>

</div>


<div class="border-t p-4 border-[#E4E4E7]"><!-- author and date -->
<p class="text-[#64748B]">${author}</p>
<p class="text-[#64748B]">${createdAt.slice(0, 10)}</p></div>


</div>
  `;
    issuesCardContainer.appendChild(issueCard);
  });

  issuesCount.innerText = issuesCardContainer.children.length;
}

getAllIssues();

// tab issues

tabButtonsContainer.addEventListener("click", (e) => {
  const targetButton = e.target;

  if (targetButton.classList.contains("tab-button")) {
    const allButtons = tabButtonsContainer.querySelectorAll(".tab-button");

    allButtons.forEach((button) => {
      button.classList.remove("btn-primary");
    });

    targetButton.classList.add("btn-primary");

    if (targetButton.innerText === "All") {
      getAllIssues();
    } else {
      const tabIssue = targetButton.innerText.toLowerCase();

      const filterTabIssueCards = issuesData.filter((issue) => {
        return issue.status === tabIssue;
      });
      renderIssuesUI(filterTabIssueCards);
    }
  }
});

const issuesCardContainer = elementTaker("issues-card-container");
const loadingSpinner = elementTaker("spinner-container");
const issuesCount = elementTaker("issues-count");
const tabButtonsContainer = elementTaker("tab-buttons-container");
const userSearchInput = elementTaker("user-search-input");
const searchBtn = elementTaker("search-issues-btn");
const issueDetailsModal = elementTaker("issue-details");
const detailsSpinner = elementTaker("details-loading");
const detailsModal = elementTaker("detailsShowModal");
const footerUserSearch = elementTaker("user-search-input-footer");
const footerSearchBtn = elementTaker("footer-search-issues-btn");
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
  
  <div data-id='${id}' class="detail-show card bg-base-100 shadow-lg rounded-md    border-t-4 ${status === "open" ? "border-success" : "border-[#A855F7]"} w-full h-full">

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

async function matchedSearchIssueGet(x) {
  const getMatched = await fetch(
    ` https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${x}`,
  );
  const convData = await getMatched.json();

  const { data } = convData;
  renderIssuesUI(data);
}

searchBtn.addEventListener("click", () => {
  const searchValue = userSearchInput.value;
  matchedSearchIssueGet(searchValue);
  userSearchInput.value = "";
});

footerSearchBtn.addEventListener("click", () => {
  const searchValue = footerUserSearch.value;
  matchedSearchIssueGet(searchValue);
  footerUserSearch.value = "";
});

async function issueDetailsGet(x) {
  const getDetailsData = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${x}`,
  );
  const convData = await getDetailsData.json();

  const { data } = convData;

  const {
    title,
    description,
    status,
    labels,
    priority,
    author,
    assignee,
    updatedAt,
  } = data;

  issueDetailsModal.innerHTML = `

<div>
  <h4 class="font-bold text-2xl mb-2">${title}</h4>
  <ul class="flex">
    <li>${status === "open" ? "<span class='badge badge-success text-white rounded-full'>Opened</span>" : "<span class='badge badge-primary  rounded-full'>Closed</span>"}</li>
    <li class="text-[#64748B] list-disc ml-7">Opened by ${assignee ? assignee : "Unknown"}</li>
  <li class="text-[#64748B] list-disc ml-7">${updatedAt.slice(0, 10)}</li>
  </ul>
  <div class='mt-6'>${labelsSet(labels)}</div>
</div> 

<p class="text-[#64748B]">${description}</p>

<div class="bg-[#F8FAFC] p-4 rounded-lg grid grid-cols-2">
<div >
<p class="text-[#64748B] mb-2">Assignee:</p>
<p class="font-semibold text-[#1F2937]">${assignee ? assignee : "Unknown"}</p>
</div>
<div>
  <p class="text-[#64748B] mb-2">Priority:</p>
<p>${setPriorityBatch(priority)}</p>
</div>
</div>
`;

  detailsModal.showModal();
}

issuesCardContainer.addEventListener("click", (e) => {
  const targetElement = e.target;

  const getIssueCard = targetElement.closest(".detail-show");
  const issueID = getIssueCard.dataset.id;
  issueDetailsGet(Number(issueID));
});

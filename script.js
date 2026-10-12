
/* =========================
   1. MENGAMBIL ELEMEN HTML
========================= */

const todoForm = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const taskPriority = document.getElementById("task-priority");
const taskDeadline = document.getElementById("task-deadline");

const todoList = document.getElementById("todo-list");
const doneList = document.getElementById("done-list");

const todoCount = document.getElementById("todo-count");
const doneCount = document.getElementById("done-count");

const currentDate = document.getElementById("current-date");
const deleteAllButton = document.getElementById("delete-all");



/* =========================
   2. MENAMPILKAN TANGGAL
========================= */

const today = new Date();

currentDate.textContent = today.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
});


/* =========================
   3. MENYIMPAN DAFTAR TUGAS
========================= */

let tasks = [];
let nextTaskId = 1;


/* =========================
   4. MENAMBAHKAN TUGAS
========================= */

todoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Silakan tulis tugas terlebih dahulu.");
        return;
    }

    const newTask = {
        id: nextTaskId,
        title: taskText,
        priority: taskPriority.value,
        date: new Date(),
        deadline: taskDeadline.value,
        completed: false
    };

    tasks.push(newTask);
    nextTaskId++;

    renderTasks();

    todoForm.reset();
    taskPriority.value = "medium";
});


/* =========================
   5. MENAMPILKAN TUGAS
========================= */

function renderTasks() {
    todoList.innerHTML = "";
    doneList.innerHTML = "";

    tasks.forEach(function (task) {
        const taskCard = document.createElement("div");
        taskCard.classList.add("task-card");

        // Bagian judul tugas dan checkbox
        const taskHeader = document.createElement("div");
        taskHeader.classList.add("task-header");

        const taskLabel = document.createElement("label");
        taskLabel.classList.add("task-label");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Tandai tugas selesai");

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            renderTasks();
        });

        const taskTitle = document.createElement("span");
        taskTitle.classList.add("task-title");
        taskTitle.textContent = task.title;

        if (task.completed) {
            taskTitle.classList.add("completed");
        }

        taskLabel.append(checkbox, taskTitle);

        // Bagian prioritas
        const priorityBadge = document.createElement("span");
        priorityBadge.classList.add(
            "priority-badge",
            task.priority
        );

        const priorityNames = {
            low: "Low",
            medium: "Medium",
            high: "High"
        };

        priorityBadge.textContent = priorityNames[task.priority];

        taskHeader.append(taskLabel, priorityBadge);

        // Bagian tanggal
        const taskDate = document.createElement("p");
        taskDate.classList.add("task-date");

        taskDate.textContent = "Ditambahkan: " +
            task.date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric"
            });

        // Memeriksa apakah tugas sudah melewati deadline
        if (task.deadline) {
            const today = new Date();
            const localToday = [
                today.getFullYear(),
                String(today.getMonth() + 1).padStart(2, "0"),
                String(today.getDate()).padStart(2, "0")
            ].join("-");

            const deadlineDate = new Date(
                task.deadline + "T00:00:00"
            ).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric"
            });

            taskDate.textContent += " | Deadline: " + deadlineDate;

            if (!task.completed && task.deadline < localToday) {
                const overdueLabel = document.createElement("span");
                overdueLabel.classList.add("overdue-label");
                overdueLabel.textContent = "Overdue";
                taskDate.append(" ", overdueLabel);
            }
        }

        // Tombol hapus satu tugas
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList.add("btn-delete");
        deleteButton.textContent = "Hapus";
        deleteButton.setAttribute("aria-label", "Hapus tugas");

        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });

            renderTasks();
        });

        taskCard.append(taskHeader, taskDate, deleteButton);

        // Memasukkan tugas ke kolom yang sesuai
        if (task.completed) {
            doneList.appendChild(taskCard);
        } else {
            todoList.appendChild(taskCard);
        }
    });

    // Memperbarui jumlah tugas
    todoCount.textContent = tasks.filter(function (task) {
        return !task.completed;
    }).length;

    doneCount.textContent = tasks.filter(function (task) {
        return task.completed;
    }).length;
}


/* =========================
   6. MENGHAPUS SEMUA TUGAS
========================= */

deleteAllButton.addEventListener("click", function () {
    if (tasks.length === 0) {
        alert("Belum ada tugas untuk dihapus.");
        return;
    }

    const confirmation = confirm(
        "Apakah kamu yakin ingin menghapus semua tugas?"
    );

    if (confirmation) {
        tasks = [];
        renderTasks();
    }
});


/* =========================
   7. TAMPILAN AWAL
========================= */

renderTasks();

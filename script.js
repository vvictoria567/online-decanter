const pages = document.querySelectorAll(".page");
const navItems = document.querySelectorAll(".nav-item");
const pageButtons = document.querySelectorAll("[data-page]");

function showPage(pageId) {
    pages.forEach(page => {
        page.classList.toggle("active", page.id === pageId);
    });

    navItems.forEach(item => {
        item.classList.toggle(
            "active",
            item.dataset.page === pageId
        );
    });
}

/* Переходы из меню и карточек */
pageButtons.forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});

/* Главная -> загрузка документа */
document.getElementById("open-upload").addEventListener("click", () => {
    showPage("documents");
});

/* Возврат на главную */
document.getElementById("back-home").addEventListener("click", () => {
    showPage("home");
});

/* Правила приёма — пока заглушка */
document.getElementById("admission-rules").addEventListener("click", () => {
    alert("Раздел «Правила приёма» пока в разработке.");
});

/* Выбор файла */
const input = document.getElementById("document-input");
const dropZone = document.getElementById("drop-zone");
const chooseFileButton = document.getElementById("choose-file");
const selectedFile = document.getElementById("selected-file");

chooseFileButton.addEventListener("click", () => {
    input.click();
});

/* Проверка файла */
function handleFile(file) {
    if (!file) return;

    const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png"
    ];

    if (!allowedTypes.includes(file.type)) {
        selectedFile.textContent =
            "Выберите файл в формате PDF, JPG или PNG.";
        input.value = "";
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        selectedFile.textContent =
            "Размер файла не должен превышать 10 МБ.";
        input.value = "";
        return;
    }

    selectedFile.textContent = "Выбран файл: " + file.name;
}

input.addEventListener("change", () => {
    handleFile(input.files[0]);
});

/* Перетаскивание файла */
["dragenter", "dragover"].forEach(eventName => {
    dropZone.addEventListener(eventName, event => {
        event.preventDefault();
        dropZone.classList.add("drag-over");
    });
});

["dragleave", "drop"].forEach(eventName => {
    dropZone.addEventListener(eventName, event => {
        event.preventDefault();
        dropZone.classList.remove("drag-over");
    });
});

dropZone.addEventListener("drop", event => {
    const file = event.dataTransfer.files[0];
    handleFile(file);
});




// Поля, которые проверяются в студенческом билете
const documentFields = [
    "ФИО",
    "Дата рождения",
    "Серия и номер документа",
    "Фотография",
    "Подпись"
];

// Отображение результата проверки
function renderReviewResult(result) {
    const status = document.getElementById("result-status");
    const icon = document.getElementById("status-icon");
    const title = document.getElementById("status-title");
    const description = document.getElementById("status-description");
    const list = document.getElementById("requirements-list");

    const filename = document.getElementById("result-filename");
    const date = document.getElementById("result-date");

    filename.textContent = result.filename || "Студенческий билет";
    date.textContent = result.date || new Date().toLocaleDateString("ru-RU");

    // Если документ не удалось распознать
    if (result.status === "scan_failed") {
        status.className = "result-status warning";
        icon.textContent = "!";
        title.textContent = "Не удалось распознать документ";
        description.textContent =
            "Попробуйте загрузить более чёткое изображение.";

        list.innerHTML = `
            <div class="requirement-row missing">
                <span class="requirement-icon">!</span>
                <span class="requirement-name">Распознавание документа</span>
                <span class="requirement-result">Не выполнено</span>
            </div>
        `;
        return;
    }

    // Если документ распознан, но есть отсутствующие сведения
    const missing = result.missingFields || [];
    const mismatched = result.mismatchedFields || [];

    if (missing.length > 0 || mismatched.length > 0) {
        status.className = "result-status warning";
        icon.textContent = "!";
        title.textContent = "Не хватает данных";
        description.textContent =
            "В документе отсутствуют или не совпадают обязательные сведения.";
    } else {
        status.className = "result-status success";
        icon.textContent = "✓";
        title.textContent = "Документы в порядке";
        description.textContent = "Все обязательные сведения найдены и совпадают.";
    }

    // Список полей и их результатов
    list.innerHTML = "";

    documentFields.forEach(field => {
        const isMissing = missing.includes(field);
        const isMismatched = mismatched.includes(field);

        const row = document.createElement("div");
        row.className = "requirement-row " +
            (isMissing || isMismatched ? "missing" : "found");

        const symbol = isMissing || isMismatched ? "!" : "✓";

        let message = "Найдено";
        if (isMissing) message = "Не обнаружено на документе";
        if (isMismatched) message = "Данные не совпадают";

        const iconElement = document.createElement("span");
        iconElement.className = "requirement-icon";
        iconElement.textContent = symbol;

        const nameElement = document.createElement("span");
        nameElement.className = "requirement-name";
        nameElement.textContent = field;

        const resultElement = document.createElement("span");
        resultElement.className = "requirement-result";
        resultElement.textContent = message;

        row.append(iconElement, nameElement, resultElement);
        list.appendChild(row);
    });
}

// Возврат к загрузке документа
document.getElementById("back-documents").addEventListener("click", () => {
    showPage("documents");
});

// Переход к чату с вопросом о документе
document.getElementById("ask-about-document").addEventListener("click", () => {
    showPage("chat");
});





const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const quickQuestions = document.getElementById("quick-questions");

// Демонстрационные ответы для фронтенда
const chatAnswers = [
    {
        keywords: ["справк", "академическ"],
        answer:
            "Академическую справку обычно можно запросить через личный кабинет студента. Выберите соответствующий раздел, заполните заявление и отправьте его. Точный порядок получения уточните в деканате."
    },
    {
        keywords: ["сесс", "экзамен"],
        answer:
            "Информация о сессии обычно публикуется в расписании университета или личном кабинете студента. Следите за объявлениями вашего факультета."
    },
    {
        keywords: ["расписан", "пары", "занят"],
        answer:
            "Расписание занятий можно посмотреть на сайте университета или в личном кабинете. Если не нашли нужную информацию, обратитесь в деканат."
    }
];

// Добавление сообщения в переписку
function addChatMessage(text, sender) {
    const message = document.createElement("div");
    message.className = `message message-${sender}`;

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.textContent = text;

    message.appendChild(bubble);
    chatMessages.appendChild(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Подбор демонстрационного ответа
function getChatAnswer(text) {
    const normalizedText = text.toLowerCase();

    const match = chatAnswers.find(item =>
        item.keywords.some(keyword => normalizedText.includes(keyword))
    );

    if (match) {
        return match.answer;
    }

    return "Спасибо за вопрос! Я пока работаю в демонстрационном режиме. Попробуйте спросить о получении справки, сессии или расписании.";
}

// Отправка сообщения
function sendChatMessage(text) {
    const messageText = text.trim();

    if (!messageText) return;

    // Вопрос пользователя отображается справа
    addChatMessage(messageText, "user");

    // Скрываем быстрые вопросы после первого обращения
    if (quickQuestions) {
        quickQuestions.remove();
    }

    chatInput.value = "";
    chatInput.focus();

    // Имитация ответа секретаря
    const answer = getChatAnswer(messageText);

    setTimeout(() => {
        addChatMessage(answer, "bot");
    }, 400);
}

// Отправка через поле ввода
chatForm.addEventListener("submit", event => {
    event.preventDefault();
    sendChatMessage(chatInput.value);
});

// Быстрые вопросы превращаются в сообщения пользователя
document.querySelectorAll(".quick-question").forEach(button => {
    button.addEventListener("click", () => {
        sendChatMessage(button.dataset.question);
    });
});
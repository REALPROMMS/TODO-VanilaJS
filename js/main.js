// !Находим элементы на странице

// const form = document.getElementById('form');
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');
const removeDoneTasks = document.querySelector('#removeDoneTasks')

let tasks = [];

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'))
	tasks.forEach((task) => renderTast(task)
	)
}

checkEmptyList()

// !Удаление задач всех выполненных
removeDoneTasks.addEventListener('click', deleteAllTask)

// !Добавление задачи
form.addEventListener('submit', addTask) // не надо ставить скобки у функции ,что бы она сработала не сразу а после 'sumbit'

// !Удаление задачи
tasksList.addEventListener('click', deleteTask)

// !Отмечаем задачу выполненой
tasksList.addEventListener('click', doneTask)

// !Функции
// function декларэйшен позвоялет вызывать ее выше( 9 строчка), чем написан сам код (13 строчка)
function addTask(event) {
	// Отменяем отправку формы
	event.preventDefault();

	// Достаем текст из данного input
	const taskText = taskInput.value;

	// Описываем задачу в виде объекта
	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false
	};

	// Добавялем задачу в массив с задачами
	tasks.push(newTask)

	// !---

	renderTast(newTask)

	// 	// Формируем css класс
	// 	// const cssClass = newTask.done === false ? 'task-title' : 'task-title task-title--done'
	// 	const cssClass = newTask.done ? 'task-title task-title--done' : 'task-title'

	// 	// Формируем новую разметку для новой задачи(кусок HTML)
	// 	const taskHTML = `<li id="${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
	// 	<span class="${cssClass}">${newTask.text}</span>
	// 	<div class="task-item__buttons">
	// 		<button type="button" data-action="done" class="btn-action">
	// 			<img src="./img/tick.svg" alt="Done" width="18" height="18">
	// 		</button>
	// 		<button type="button" data-action="delete" class="btn-action">
	// 			<img src="./img/cross.svg" alt="Done" width="18" height="18">
	// 		</button>
	// 	</div>
	// </li>`

	// 	// Добавляем набранный текст в список дел (в html)
	// 	tasksList.insertAdjacentHTML('beforeend', taskHTML)
	// !---

	// Очищаем поле ввода и возвращаем на input фокус
	taskInput.value = '';
	taskInput.focus();

	// Проверка. Если в списке задач более 1й задачи( тега li) то скрываем "Список дел пуст"
	// if (tasksList.children.length > 1) {
	// 	emptyList.classList.add('none')
	// }

	// if (tasks.length >= 1) {
	// 	emptyList.classList.add('none')
	// }
	checkEmptyList()
	saveToLocalStorage()
}

function deleteTask(event) {
	// Проверяем что click был по кнопке button(в css прописанно на img pointer-events:none что бы клик не проходил по картинке)
	if (event.target.dataset.action === 'delete') {
		// event.target.closest('.list-group-item ').remove(event.target)
		const parentNode = event.target.closest('.list-group-item ');

		// Определяем ID задачи
		const id = Number(parentNode.id) // приравняли строку к числу

		// Находим индекс задачи в массиве
		const index = tasks.findIndex((task) => {
			if (task.id === id) {
				return true
			}

			// return task.id === id // возвращает результат сравнения false or true
		})

		// удаляем задачу из массива по индексу
		tasks.splice(index, 1)


		// удаляем задачу из массива(2 способ)

		// tasks = tasks.filter((task) => {
		// 	if (task.id === id) {
		// 		return false
		// 	} else {
		// 		return true
		// 	}

		// return task.id !== id // скоращение кода
		// })

		// удаляем задачу из разметки
		parentNode.remove()

		// if (tasksList.children.length === 1) {
		// 	emptyList.classList.remove('none')
		// }


		// if (tasks.length === 0) {
		// 	emptyList.classList.remove('none')
		// }
	}
	checkEmptyList()
	saveToLocalStorage()
}

function doneTask(event) {
	if (event.target.dataset.action === 'done') {
		const parentNode = event.target.closest('.list-group-item');

		// id задачи
		const id = Number(parentNode.id);
		const task = tasks.find((task) => {
			if (task.id === id)
				return true
		})

		task.done = !task.done;

		const taskTitle = parentNode.querySelector('.task-title');
		taskTitle.classList.toggle('task-title--done');
	}
	saveToLocalStorage()
}

function checkEmptyList() {
	if (tasks.length === 0) {

		const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
	<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
	<div class="empty-list__title">Список дел пуст</div>
</li>`

		tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
	}
	if (tasks.length > 0) {
		const emptyListEl = document.querySelector('#emptyList')
		emptyListEl ? emptyListEl.remove() : null;
	}


}

function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTast(task) {
	// Формируем css класс
	const cssClass = task.done ? 'task-title task-title--done' : 'task-title'

	// Формируем новую разметку для новой задачи(кусок HTML)
	const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
	<span class="${cssClass}">${task.text}</span>
	<div class="task-item__buttons">
		<button type="button" data-action="done" class="btn-action">
			<img src="./img/tick.svg" alt="Done" width="18" height="18">
		</button>
		<button type="button" data-action="delete" class="btn-action">
			<img src="./img/cross.svg" alt="Done" width="18" height="18">
		</button>
	</div>
</li>`

	// Добавляем набранный текст в список дел (в html)
	tasksList.insertAdjacentHTML('beforeend', taskHTML)
}

function deleteAllTask() {
	tasks
		.filter(task => task.done)
		.forEach(task => document.getElementById(task.id).remove())

	tasks = tasks.filter(task => !task.done);
	saveToLocalStorage();
}






function showToDoTasks(index, subtasksClass, names) {
  return `
            <div id="task-card-${index}" onclick="renderTaskDetail('${index}')" draggable="true" ondragstart="startDragging(${index})" ondragover="allowDrop(event)" class="tasks-content">
                <div class="tasks-content-header margin">
                    <div class="tasks-content-${getCategoryClass(index)} ">${allTasks[index].category}</div>
                    <div class="move-to-button-mobile-container">
                        <img onclick="openMoveTaskOverlay('overlayMoveToTodo_${index}', event)" class="move-to-button-mobile" src="./asset/images/move-to-button-mobile-board.svg" alt="">
                            <div id="overlayMoveToTodo_${index}" class="overlay-move-to-button d-none" onclick="event.stopPropagation()">
                                <div class="overlay-move-to-button-content">
                                    <div class="overlay-move-to-button-inner-content-headline">
                                        <a class="overlay-move-to-button-headline">Move to</a>
                                    </div>    
                                    <div onclick="moveToMobile('overlayMoveToTodo_${index}', '${index}', 'in Progress', event)" class="overlay-move-to-button-inner-content">
                                        <img class="overlay-move-to-button-arrow" src="./asset/images/arrow_downward.svg" alt="">
                                        <span>in Progress</span>
                                    </div>
                                </div>
                            </div>
                    </div>        
                </div>
                <span class="tasks-content-title margin">${allTasks[index].title}</span>
                <span class="tasks-content-description margin">${allTasks[index].description}</span>
                <div class="tasks-content-done ${subtasksClass}">
                    <progress class="tasks-content-done-progressbar" class="progress-bar" value="${getDoneSubtasks(index)}" max="${subTaskLength(index)}" style="--value: 1; --max: ${subTaskLength(index)};"></progress>
                    <span class="tasks-content-done-text">${getDoneSubtasks(index)}/${subTaskLength(index)} Subtasks</span>
                </div>
                <div class="assigned-priority-container margin">
                        <div class="assigned-container">
                            ${names[0] && isNameInContacts(names[0]) ? `<span class="assigned" style="background-color: ${getBackgroundColorNames(names[0])};">${getInitials(names[0])}</span>`
                                : ""
                            }
                            ${names[1] && isNameInContacts(names[1]) ? `<span class="assigned" style="background-color: ${getBackgroundColorNames(names[1])};">${getInitials(names[1])}</span>`
                                : ""
                            }
                            ${names[2] && isNameInContacts(names[2]) ? `<span class="assigned" style="background-color: ${getBackgroundColorNames(names[2])};">${getInitials(names[2])}</span>`
                                : ""
                            }
                            ${names[3] && isNameInContacts(names[3]) ? `<span class="assigned" style="background-color: ${getBackgroundColorNames(names[3])};">${getInitials(names[3])}</span>`
                                : ""
                            }
                            ${names[4] && renderAdditionalAssigned(names) ? `<span class="assigned-plus">+${renderAdditionalAssigned(names)}</span>`
                                : ""
                            }
                        </div>
                    <div class="priority-${allTasks[index].priority}"></div>
                </div>
            </div>
        `;
}

function showInProgressTasks(index, subtasksClass, names) {
  return `
            <div id="task-card-${index}" onclick="renderTaskDetail('${index}')" draggable="true" ondragstart="startDragging(${index})" ondragover="allowDrop(event)" class="tasks-content">
                <div class="tasks-content-header margin">
                    <div class="tasks-content-${getCategoryClass(index)}">${allTasks[index].category}</div>
                    <div class="move-to-button-mobile-container">
                        <img onclick="openMoveTaskOverlay('overlayMoveToProgress_${index}', event)" class="move-to-button-mobile" src="./asset/images/move-to-button-mobile-board.svg" alt="">
                            <div id="overlayMoveToProgress_${index}" class="overlay-move-to-button d-none" onclick="event.stopPropagation()">
                                <div class="overlay-move-to-button-content">
                                    <div class="overlay-move-to-button-inner-content-headline">
                                        <a class="overlay-move-to-button-headline">Move to</a>
                                    </div>    
                                    <div onclick="moveToMobile('overlayMoveToProgress_${index}','${index}', 'To do', event)" class="overlay-move-to-button-inner-content">
                                        <img class="overlay-move-to-button-arrow" src="./asset/images/arrow_upward.svg" alt="">
                                        <span>To do</span>
                                    </div>
                                    <div onclick="moveToMobile('overlayMoveToProgress_${index}','${index}', 'await Feedback', event)" class="overlay-move-to-button-inner-content">
                                        <img class="overlay-move-to-button-arrow" src="./asset/images/arrow_downward.svg" alt="">
                                        <span>Feedback</span>
                                    </div>
                                </div>
                            </div>
                    </div>        
                </div>
                <span class="tasks-content-title margin">${allTasks[index].title}</span>
                <span class="tasks-content-description margin">${allTasks[index].description}</span>                
                <div id="subtasks" class="tasks-content-done ${subtasksClass}">
                    <progress class="tasks-content-done-progressbar" class="progress-bar" value="${getDoneSubtasks(index)}" max="${subTaskLength(index)}" style="--value: 1; --max: ${subTaskLength(index)};"></progress>
                    <span class="tasks-content-done-text">${getDoneSubtasks(index)}/${subTaskLength(index)} Subtasks</span>
                </div>                
                    <div class="assigned-priority-container margin">
                        <div class="assigned-container">
                            ${ names[0] && isNameInContacts(names[0]) ? `<span class="assigned" style="background-color: ${getBackgroundColorNames(names[0])};">${getInitials(names[0])}</span>`
                                : ""
                            }
                            ${names[1] && isNameInContacts(names[1]) ? `<span class="assigned" style="background-color: ${getBackgroundColorNames(names[1])};">${getInitials(names[1])}</span>`
                                : ""
                            }
                            ${names[2] && isNameInContacts(names[2]) ? `<span class="assigned" style="background-color: ${getBackgroundColorNames(names[2])};">${getInitials(names[2])}</span>`
                                : ""
                            }
                            ${names[3] && isNameInContacts(names[3]) ? `<span class="assigned" style="background-color: ${getBackgroundColorNames(names[3])};">${getInitials(names[3])}</span>`
                                : ""
                            }
                            ${names[4] && renderAdditionalAssigned(names) ? `<span class="assigned-plus">+${renderAdditionalAssigned(names)}</span>`
                                : ""
                            }
                        </div>
                        <div class="priority-${allTasks[index].priority}"></div>
                    </div>
            </div>
        `;
}

function showAwaitFeedbackTasks(index, subtasksClass, names) {
  return `
            <div id="task-card-${index}" onclick="renderTaskDetail('${index}')" draggable="true" ondragstart="startDragging(${index})" ondrop="moveTo('await Feedback')" ondragover="allowDrop(event)" class="tasks-content">
                <div class="tasks-content-header margin">
                    <div class="tasks-content-${getCategoryClass(index)}">${allTasks[index].category}</div>
                    <div class="move-to-button-mobile-container">
                        <img onclick="openMoveTaskOverlay('overlayMoveToAwaitFeedback_${index}', event)" class="move-to-button-mobile" src="./asset/images/move-to-button-mobile-board.svg" alt="">
                            <div id="overlayMoveToAwaitFeedback_${index}" class="overlay-move-to-button d-none" onclick="event.stopPropagation()">
                                <div class="overlay-move-to-button-content">
                                    <div class="overlay-move-to-button-inner-content-headline">
                                        <a class="overlay-move-to-button-headline">Move to</a>
                                    </div>    
                                    <div onclick="moveToMobile('overlayMoveToAwaitFeedback_${index}','${index}', 'in Progress', event)" class="overlay-move-to-button-inner-content">
                                        <img class="overlay-move-to-button-arrow" src="./asset/images/arrow_upward.svg" alt="">
                                        <span>in Progress</span>
                                    </div>
                                    <div onclick="moveToMobile('overlayMoveToAwaitFeedback_${index}','${index}', 'done', event)" class="overlay-move-to-button-inner-content">
                                        <img class="overlay-move-to-button-arrow" src="./asset/images/arrow_downward.svg" alt="">
                                        <span>Done</span>
                                    </div>
                                </div>
                            </div>
                    </div>        
                </div>
                <span class="tasks-content-title margin">${allTasks[index].title}</span>
                <span class="tasks-content-description margin">${allTasks[index].description}</span>
                <div class="tasks-content-done ${subtasksClass}">
                    <progress class="tasks-content-done-progressbar" class="progress-bar" value="${getDoneSubtasks(index)}" max="${subTaskLength(index)}" style="--value: 1; --max: ${subTaskLength(index)};"></progress>
                    <span class="tasks-content-done-text">${getDoneSubtasks(index)}/${subTaskLength(index)} Subtasks</span>
                </div>
                <div class="assigned-priority-container margin">
                    <div class="assigned-container">
                        ${names[0] && isNameInContacts(names[0]) ? `<span class="assigned" style="background-color: ${getBackgroundColorNames(names[0])};">${getInitials(names[0])}</span>`
                            : ""
                        }
                        ${names[1] && isNameInContacts(names[1]) ? `<span class="assigned" style="background-color: ${getBackgroundColorNames(names[1])};">${getInitials(names[1])}</span>`
                            : ""
                        }
                        ${names[2] && isNameInContacts(names[2]) ? `<span class="assigned" style="background-color: ${getBackgroundColorNames(names[2])};">${getInitials(names[2])}</span>`
                            : ""
                        }
                        ${names[3] && isNameInContacts(names[3]) ? `<span class="assigned" style="background-color: ${getBackgroundColorNames(names[3])};">${getInitials(names[3])}</span>`
                            : ""
                        }
                        ${names[4] && renderAdditionalAssigned(names) ? `<span class="assigned-plus">+${renderAdditionalAssigned(names)}</span>`
                            : ""
                        }
                    </div>
                    <div class="priority-${allTasks[index].priority}"></div>
                </div>
            </div>
        `;
}

function showDoneTasks(index, subtasksClass, names) {
  return `
            <div id="task-card-${index}" onclick="renderTaskDetail('${index}')" draggable="true" ondragstart="startDragging(${index})" ondrop="moveTo('done')" ondragover="allowDrop(event)" class="tasks-content">
                <div class="tasks-content-header margin">
                    <div class="tasks-content-${getCategoryClass(index)}">${allTasks[index].category}</div>
                    <div class="move-to-button-mobile-container">
                        <img onclick="openMoveTaskOverlay('overlayMoveToDone_${index}', event)" class="move-to-button-mobile" src="./asset/images/move-to-button-mobile-board.svg" alt="">
                            <div id="overlayMoveToDone_${index}" class="overlay-move-to-button d-none" onclick="event.stopPropagation()">
                                <div class="overlay-move-to-button-content">
                                    <div class="overlay-move-to-button-inner-content-headline">
                                        <a class="overlay-move-to-button-headline">Move to</a>
                                    </div>    
                                    <div onclick="moveToMobile('overlayMoveToDone_${index}','${index}', 'await Feedback', event)" class="overlay-move-to-button-inner-content">
                                        <img class="overlay-move-to-button-arrow" src="./asset/images/arrow_upward.svg" alt="">
                                        <span>Feedback</span>
                                    </div>
                                </div>
                            </div>
                    </div>        
                </div>
                <span class="tasks-content-title margin">${allTasks[index].title}</span>
                <span class="tasks-content-description margin">${allTasks[index].description}</span>
                <div class="tasks-content-done ${subtasksClass}">
                    <progress class="tasks-content-done-progressbar" class="progress-bar" value="${getDoneSubtasks(index )}" max="${subTaskLength(index)}" style="--value: 1; --max: ${subTaskLength(index)};"></progress>
                    <span class="tasks-content-done-text">${getDoneSubtasks(index)}/${subTaskLength(index)} Subtasks</span>
                </div>
                <div class="assigned-priority-container margin">
                    <div class="assigned-container">
                        ${names[0] && isNameInContacts(names[0]) ? `<span class="assigned" style="background-color: ${getBackgroundColorNames(names[0])};">${getInitials(names[0])}</span>`
                            : ""
                        }
                        ${names[1] && isNameInContacts(names[1]) ? `<span class="assigned" style="background-color: ${getBackgroundColorNames(names[1])};">${getInitials(names[1])}</span>`
                            : ""
                        }
                        ${names[2] && isNameInContacts(names[2]) ? `<span class="assigned" style="background-color: ${getBackgroundColorNames(names[2])};">${getInitials(names[2])}</span>`
                            : ""
                        }
                        ${names[3] && isNameInContacts(names[3]) ? `<span class="assigned" style="background-color: ${getBackgroundColorNames(names[3])};">${getInitials(names[3])}</span>`
                            : ""
                        }
                        ${names[4] && renderAdditionalAssigned(names) ? `<span class="assigned-plus">+${renderAdditionalAssigned(names )}</span>`
                            : ""
                        }
                    </div>
                    <div class="priority-${allTasks[index].priority}"></div>
                </div>
            </div>
        `;
}

function showTaskDetail(index, names, subtasksClass) {
  return `
        <div id="taskDetail" class="scrollbar-container-taskdetail slide-in">   
            <div  onclick="noBubbling(event)" class="task-detail-container">
                <div class="task-detail-head">
                    <span class="overlay-tasks-content-${getCategoryClass(index)}">${allTasks[index].category}</span>
                    <img onclick="closeOverlay()" class="task-detail-close-button" src="./asset/images/board-close-overlay.png" alt="">
                </div>
                <span class="task-detail-title">${allTasks[index].title}</span>
                <span class="task-detail-description">${allTasks[index].description}</span>
                <span class="task-detail-due-date">Due date: ${taskDetailDueDate(allTasks[index].duedate)}</span>
                <div class="task-detail-due-priority-container">
                    <span class="task-detail-due-priority-text">Priority: </span>
                    <span class="task-detail-due-priority">${!allTasks[index].priority ? `Low` : allTasks[index].priority }</span>
                    <div class="task-detail-priority-${!allTasks[index].priority ? `Low` : allTasks[index].priority}"></div>
                </div>
                <span class="task-detail-due-date">Assigned To:</span>
                ${allTasks[index].assigned !== "" ? `<div class="task-detail-assigned">` +
                      (function () {
                        let assignedHtml = "";
                        for (let i = 0; i < names.length; i++) {
                          if (names[i] && isNameInContacts(names[i])) {
                            assignedHtml += `
                                    <div class="task-detail-assigned-container">
                                        <span class="task-detail-assigned-initials" style="background-color: ${getBackgroundColorNames(
                                          names[i]
                                        )};">${getInitials(names[i])}</span>
                                        <span class="task-detail-assigned-name">${
                                          names[i]
                                        }</span>
                                    </div>
                                `;
                          }
                        }
                        return assignedHtml;
                      })() +
                      `</div>`
                    : ""
                }
                <div id="subTasksOverlay">
                ${subtaskContent.length > 0 ? `<div class="task-detail-subtasks-container ${subtasksClass}">        
                        <span class="task-detail-subtasks">Subtasks</span>
                        ${(() => {
                          let subtaskHTML = "";
                          for (let i = 0; i < subtaskContent.length; i++) {
                            subtaskHTML += `
                                    <div class="task-detail-subtask-container">
                                        <div onclick="changeSubtaskComplete('${index}', '${i}'); changeSubtaskCompleteApi('${index}', '${i}')" class="task-detail-subtask-image-${getSubTaskImage(i)}"></div>
                                        <div class="task-detail-subtask-text">${
                                          subtaskContent[i].name
                                        }</div><br>
                                    </div>
                                `;
                          }
                          return subtaskHTML;
                        })()}
                    </div>`
                    : ""
                }
                </div>    
                ${renderAttachmentsInDetail(allTasks[index].attachments, index)}
                <div class="task-detail-delete-edit-container">
                    <div onclick="deleteTask('${index}'),addTaskInit()" class="task-detail-delete-container">
                        <img class="task-detail-delete-image" src="./asset/images/board-task-detail-delete.png" alt="">
                        <Span class="task-detail-delete-text">Delete</Span>
                    </div>
                    <div class="task-detail-delete-container-border"></div>
                    <div onclick="renderEditTaskOverlay(${index})" class="task-detail-delete-container">
                        <img class="task-detail-edit-image" src="./asset/images/board-task-detail-edit.png" alt="">
                        <Span class="task-detail-delete-text">Edit</Span>
                    </div>
                </div>
            </div>
        <div>     
        `;
}

function showOverlaySubtasks(index, subtasksClass) {
  let subtasks = allTasks[index].subtasks;
  let subtaskHTML = "";
  if (subtasks && subtasks.length > 0) {
    subtaskHTML += `
            <div class="task-detail-subtasks-container ${subtasksClass}">        
                <span class="task-detail-subtasks">Subtasks</span>
            `;
    for (let i = 0; i < subtasks.length; i++) {
      let completed = subtasks[i].completed === true ? "on" : "off";
      subtaskHTML += `
                <div class="task-detail-subtask-container">
                    <div onclick="changeSubtaskComplete('${index}', '${i}'); changeSubtaskCompleteApi('${index}', '${i}')" class="task-detail-subtask-image-${completed}"></div>
                    <div class="task-detail-subtask-text">${subtasks[i].name}</div><br>
                </div>
            `;
    }
    subtaskHTML += `</div>`;
  }
  return subtaskHTML;
}

function showAddTaskOverlay() {
  return `               
        <div>
        <div id="addTaskOverlay" class="add-task-overlay-board slide-in wide-overlay" onclick="noBubbling(event)">                   
            <div class="add-task-overlay-close-button">
                <span class="add-task-overlay-close-header">Add Task</span>
                <img onclick="closeAddTaskOverlay()" class="task-detail-close-button" src="./asset/images/board-close-overlay.png" alt=""></div>
            <div class="content_box">
                <div class="left-content-maincontent">
                    <div class="element-container">
                        <label for="title-task" class="required">Title</label> <br>
                        <input class="input_field" type="text" id="title-task" placeholder="Enter a title">
                        <p id="errorMsg-title" class="input-error">This field is required</p>
                    </div>
                    <div>
                        <label for="">Description</label><br>
                        <textarea class="input_field input_field_description" name="Description" id="description-task" placeholder="Enter a Description" ></textarea>
                    </div>
                        <div class="element-container">
                        <label for="date-task" class="required">Due date</label><br>
                        <input class="input_field" type="date" id="date-task">
                        <p id="errorMsg-date" class="input-error">This field is required</p>
                    </div>

                    <div class="file-upload-wrapper">
                      <label for="fileInput">Attachments</label><br>
                      <div id="fileDropArea" class="file-upload-drop-area" tabindex="0" role="button"
                           aria-label="Upload images. Click or press Enter to open file picker.">
                        <input type="file" id="fileInput" accept=".jpg,.jpeg,.png,.webp"
                               multiple hidden aria-label="Select image files (JPG, PNG or WebP)">
                        <span class="file-upload-icon" aria-hidden="true">🖼</span>
                        <span class="file-upload-label">Click to upload images</span>
                        <span class="file-upload-hint">JPG, PNG, WebP · max. 1 MB total</span>
                      </div>
                      <p id="errorMsg-file" class="file-upload-error" role="alert"></p>
                      <div id="filePreviewList" class="file-preview-list"></div>
                    </div>
                </div>
                <div class="splitbar"></div>
            <div>
                <div class="left-content-maincontent">
                    <label for="Priority">Priority</label><br>
                    <div class="priority-button-group">
                        <button class="priorty_button urgent" data-value="Urgent" onclick="selectPriority(this)">
                            Urgent <img src="asset/img/icons/icon_urgent.png" />
                        </button>
                        <button class="priorty_button medium" data-value="Medium" onclick="selectPriority(this)">
                            Medium <img src="asset/img/icons/icon_medium.png" />
                        </button>
                        <button class="priorty_button low" data-value="Low" onclick="selectPriority(this)">
                            Low <img src="asset/img/icons/icon_low.png" />
                        </button>
                        </div>
                    </div> 
                <div class="dropdown-container">
                <label for="">Assigned to</label>
                <div class="dropdown-toggle" onclick="toggleDropdown()">
                    <input type="text" id="contactSearchInput" placeholder="Search..." oninput="filterContacts()">
                    <img src="asset/img/icons/arrow_drop_downaa.png" />
                </div>
                <div class="dropdown-menu" id="dropdownMenu">
                    <div id="dropdownContent"></div>
                </div>
                <div id="selectedContacts" class="selected-contacts"></div>
    
                </div>
                <div class="element-container">
                <label for="assigned_category" class="required">Category</label>
                    <select name="assigned_category" id="assigned_category">
                        <option value="">Select task category</option>
                        <option value="User Story">User Story</option>
                        <option value="Technical Task">Technical Task</option>
                    </select>
                <p id="errorMsg-category" class="input-error">This field is required</p>
                </div>
                
                <div class="todo-wrapper">
                <label for="Subtasks">Subtasks</label><br>
                <div class="subtask-input-wrapper">
                    <input
                        type="text"
                        id="todoInput"
                        class="input_field subtask-input"
                        placeholder="Add new subtask"
                        oninput="toggleSubtaskIcons()"
                    />
                    <button id="subtaskPlus" class="subtask-icon" onclick="addTodo()">+</button>
                    <div id="subtaskConfirmIcons" class="subtask-icon-group">
                        <img src="asset/img/icons/subtasks_icons_X.png" onclick="clearSubtaskInput()" />
                        <img src="asset/img/icons/Subtasks icons11.png" onclick="addTodo()" />
                    </div>
                    </div>
                    <div id="todoList" class="subtask-list"></div>
                </div>

            </div>
            </div>

            <div class="button_container">
                <p><span class="red-star">*</span>This field is required</p>
                <div class="button-row-overlay">
                    <button class="cancel-btn" onclick="resetForm()">Clear <img src="asset/img/icons/subtasks_icons_X.png" alt=""></button>
                    <button class="create-btn" onclick="if (validateTaskBeforeSave()) saveTask()">Create Task <img src="asset/img/icons/check.png" alt=""></button>
                </div>
                </div>
        </div>
    `;
}

function showDeleteTask(index) {
  return `
        <div id="CompletelyDeleteTask" class="delete-question-overlay">
            <span class="delete-question-overlay-text">Completely delete Task?</span>
            <div lass="delete-question-overlay-button-container">
                <span onclick="deleteTaskCompletely('${index}')" class="delete-question-overlay-button" >Yes</span>
                <Span onclick="noDelete()" class="delete-question-overlay-button">No</Span>
            </div>
        </div>
    `;
}

function showEditTaskOverlay(task, index) {
  return ` 
      <div class="scrollbar-container-taskdetail-overcontainer-board">
      <div id="taskDetail" class="scrollbar-container-taskdetail-board slide-in">                 
         <div>
         <div id="addTaskOverlay" class="add-task-overlay slide-in" onclick="noBubbling(event)">                    
             <div class="add-task-overlay-close-button-board">
                 <span class="add-task-overlay-close-header"></span>
                 <img onclick="closeAddTaskOverlay()" class="task-detail-close-button" src="./asset/images/board-close-overlay.png" alt=""></div>
             <div class="main_Box-board">                    
                     <div class="content_box-board">
                         <div class="left-content-maincontent">
                             <div class="element-container">
                                 <label for="title-task" class="required">Title</label> <br>
                                  <input class="input_field input_field-board" type="text" id="title-task" value="${task.title}">
                                 <p id="errorMsg-title" class="input-error">This field is required</p>
                             </div>
                             <div>
                                 <label for="description-task">Description</label><br>
                                  <textarea class="input_field input_field_description input_field-board" id="description-task">${task.description}</textarea>                         
                             </div>
                              <div class="element-container">
                                 <label for="date-task" class="required">Due date</label><br>
                                 <input class="input_field input_field-board" type="date" id="date-task" value="${task.duedate}">
                                 <p id="errorMsg-date" class="input-error">This field is required</p>
                             </div>

                             <div class="file-upload-wrapper">
                               <label for="fileInput">Attachments</label><br>
                               <div id="fileDropArea" class="file-upload-drop-area" tabindex="0" role="button"
                                    aria-label="Upload images. Click or press Enter to open file picker.">
                                 <input type="file" id="fileInput" accept=".jpg,.jpeg,.png,.webp"
                                        multiple hidden aria-label="Select image files (JPG, PNG or WebP)">
                                 <span class="file-upload-icon" aria-hidden="true">🖼</span>
                                 <span class="file-upload-label">Click to upload images</span>
                                 <span class="file-upload-hint">JPG, PNG, WebP · max. 1 MB total</span>
                               </div>
                               <p id="errorMsg-file" class="file-upload-error" role="alert"></p>
                               <div id="filePreviewList" class="file-preview-list"></div>
                             </div>
                         </div>
                        
                     <div class="left-content-maincontent">
                         <div >
                             <label for="Priority">Priority</label><br>
                             <div class="priority-button-group">
                                <button class="priorty_button urgent ${task.priority === "Urgent" ? "selected" : ""}" data-value="Urgent" onclick="selectPriority(this)">Urgent <img src="asset/img/icons/icon_urgent.png" /></button>
                                 <button class="priorty_button medium ${task.priority === "Medium" ? "selected" : ""}" data-value="Medium" onclick="selectPriority(this)">
                                   Medium <img src="asset/img/icons/icon_medium.png" />
                                 </button>
                                 <button class="priorty_button low ${
                                   task.priority === "Low" ? "selected" : ""
                                 }" data-value="Low" onclick="selectPriority(this)">
                                   Low <img src="asset/img/icons/icon_low.png" />
                                 </button>
                               </div>
                           </div> 
                        <div class="dropdown-container-board " id="toggleDropdown">
                         <label for="">Assigned to</label>
                         <div class="dropdown-toggle" onclick="toggleDropdown()" >
                           <input type="text" id="contactSearchInput" placeholder="Search..." oninput="filterContacts()">
                           <img src="asset/img/icons/arrow_drop_downaa.png" />
                         </div>
                         <div class="dropdown-menu " id="dropdownMenu">
                           <div id="dropdownContent"></div>
                         </div>
                         <div id="selectedContacts" class="selected-contacts"></div>
             
                       </div>
                       <div class="element-container ">
                         <label for="assigned_category" class="required">Category</label>
                             <select name="assigned_category" id="assigned_category">
                                <option value="User Story" ${task.category === "User Story" ? "selected" : ""}>User Story</option>
                                <option value="Technical Task" ${ task.category === "Technical Task" ? "selected" : "" }>Technical Task</option>
                             </select>
                         <p id="errorMsg-category" class="input-error">This field is required</p>
                       </div>
                       
                     <div class="todo-wrapper">
                        <label>Subtasks</label><br>
                        <div class="subtask-input-wrapper">
                            <input
                              type="text"
                              id="todoInput"
                              class="input_field subtask-input"
                              placeholder="Add new subtask"
                              oninput="toggleSubtaskIcons()"
                            />
                            <button id="subtaskPlus" class="subtask-icon" onclick="addTodo()">+</button>
                            <div id="subtaskConfirmIcons" class="subtask-icon-group">
                              <img src="asset/img/icons/subtasks_icons_X.png" onclick="clearSubtaskInput()" />
                              <img src="asset/img/icons/Subtasks icons11.png" onclick="addTodo()" />
                            </div>
                          </div>
                          <div id="todoList" class="subtask-list"></div>
                       </div>

                       <div class="button_container-board">
                             <p><span class="red-star">*</span>This field is required</p>
                             <div class="button-row-overlay">
                             <button class="create-btn-board" onclick="if (validateTaskBeforeSave()) saveEditedTask(${index})">OK <img src="asset/img/icons/check.png" alt=""></button>

                        </div>
                      </div>  
                    </div>
                     </div>
             </div>
             </div> 
         
         </div>  
      </div>
      
     `;
}

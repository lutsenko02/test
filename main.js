import './style.css'
const getImages = () =>
  fetch("https://boiling-refuge-66454.herokuapp.com/images");

const appElement = document.getElementById("app");

const closeImage = () => {
    const modalElement = document.querySelector(".modal");
    if (modalElement) appElement.removeChild(modalElement);
};

const openImage = (image) => {

    closeImage();

    const modalElement = document.createElement("div");
    modalElement.className = "modal";

    const modalBodyElement = document.createElement("div");
    modalBodyElement.className = "modal-body";

    const modalImageElement = document.createElement("img");
    modalImageElement.className = "modal-image";


    modalImageElement.src = image.url;

    const modalLabelElement = document.createElement("label");
    modalLabelElement.className = "modal-comments-label";
    modalLabelElement.textContent = "Comment";

    const modalCommentElement = document.createElement("textarea");
    modalCommentElement.className = "modal-comments-input";

    const modalBottomTextElement = document.createElement("p");
    modalBottomTextElement.className = "modal-comments-bottom-text";
    modalBottomTextElement.textContent = "Write a few sentences about the photo.";

    const modalButtonElement = document.createElement("button");
    modalButtonElement.className = "modal-comments-button";
    modalButtonElement.textContent = "Save";
    modalButtonElement.onclick = async e => {
      const comment = modalCommentElement.value;
      if (!comment) return;
      modalCommentElement.disabled = true;
      modalButtonElement.disabled = true;
      try {
        const response = await fetch(`https://boiling-refuge-66454.herokuapp.com/images/${image.id}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf8'
          },
          body: JSON.stringify({
            comment, 
            name: 'Ирина Луценко'
          })
        })
        console.log(response);
        modalCommentElement.value = "";
      } catch (error){
        alert(error)
      } finally {
        modalCommentElement.disabled = false;
        modalButtonElement.disabled = false;
      }
      
    }

    const commentsListElement = document.createElement("div");
    commentsListElement.className = "modal-comments-list";

    const loaderElement = document.createElement("div");
    loaderElement.className = "loader";


    appElement.appendChild(modalElement);
    modalElement.appendChild(modalBodyElement);
    modalBodyElement.appendChild(modalImageElement);
    modalBodyElement.appendChild(modalLabelElement);
    modalBodyElement.appendChild(modalCommentElement);
    modalBodyElement.appendChild(modalBottomTextElement);
    modalBodyElement.appendChild(modalButtonElement);
    modalBodyElement.appendChild(commentsListElement);
    commentsListElement.appendChild(loaderElement);


    modalElement.onclick = (e) =>
        e.target.contains(modalBodyElement) && closeImage();

    fetch(`https://boiling-refuge-66454.herokuapp.com/images/${image.id}`)
        .then((res) => res.json())
        .then(({ url, comments }) => {

            modalImageElement.src = url;

            commentsListElement.removeChild(loaderElement);

            if (comments.length) {
                comments.forEach((comment) => {

                    const commentElement = document.createElement("div");
                    commentElement.className = "modal-comment";

                    const date = new Date(comment.date);

                    const hours = `0${date.getHours()}`.slice(-2);
                    const minutes = `0${date.getMinutes()}`.slice(-2);
                    const timeString = `${hours}:${minutes}`;

                    const day = `0${date.getDate()}`.slice(-2);
                    const month = `0${date.getMonth() + 1}`.slice(-2);
                    const year = `0${date.getYear()}`.slice(-2);
                    const dateString = `${day}/${month}/${year}`;

                    commentElement.textContent = `[${timeString} ${dateString}] ${comment.text}`;

                    commentsListElement.appendChild(commentElement);
                });

            } else {
                
                const noCommentsElement = document.createElement("div");
                noCommentsElement.className = "no-comments";
                noCommentsElement.textContent = "Комментарии отсутствуют";

                commentsListElement.appendChild(noCommentsElement);
            }
        });
};

getImages()
    .then((res) => res.json())
    .then((images) => {
        images.forEach((image) => {

            const mainContainerElement = document.createElement("div");
            mainContainerElement.className = "main__container";

            const mainImageElement = document.createElement("img");
            mainImageElement.src = image.url;

            const mainIdElement = document.createElement("div");
            mainContainerElement.className = "main__container-id";
            mainIdElement.textContent = `id: ${image.id}`;

            mainImageElement.onclick = () => openImage(image);

            appElement.appendChild(mainContainerElement);
            mainContainerElement.appendChild(mainImageElement);
            mainContainerElement.appendChild(mainIdElement);
        });
    });


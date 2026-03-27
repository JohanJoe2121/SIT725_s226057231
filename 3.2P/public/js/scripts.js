
const cardList = [
  {
    title: "1984", 
    image: "images/book4.png", 
    desciption: "A dystopian novel that portrays a society under constant surveillance, where freedom is restricted and truth is controlled by a powerful government. It highlights the dangers of totalitarianism and loss of individuality." // ! Replace with your second book description
  },
  {
    title: "The Alchemist", 
    image: "images/book5.png", 
    desciption: "A philosophical novel about a young shepherd named Santiago who travels in search of treasure and discovers the importance of following one’s dreams and purpose in life." // ! Replace with your third book description
  }
];

const clickMe = () => {
  alert("Thanks for exploring these books. Hope you find something interesting!");
  
};

const submitForm = () => {
  let formData = {};
  formData.first_name = $('#first_name').val();
  formData.last_name = $('#last_name').val();
  formData.password = $('#password').val();
  formData.email = $('#email').val();

  console.log("Form Data Submitted: ", formData);
};

const addCards = (items) => {
  items.forEach(item => {
    let itemToAppend =
      '<div class="col s4 center-align">' +
        '<div class="card medium">' +
          '<div class="card-image waves-effect waves-block waves-light">' +
            '<img class="activator" src="' + item.image + '">' +
          '</div>' +
          '<div class="card-content">' +
            '<span class="card-title activator grey-text text-darken-4">' +
              item.title +
              '<i class="material-icons right">more_vert</i>' +
            '</span>' +
          '</div>' +
          '<div class="card-reveal">' +
            '<span class="card-title grey-text text-darken-4">' +
              item.title +
              '<i class="material-icons right">close</i>' +
            '</span>' +
            '<p class="card-text">' + item.desciption + '</p>' +
          '</div>' +
        '</div>' +
      '</div>';

    $("#card-section").append(itemToAppend);
  });
};

$(document).ready(function () {
  $('.materialboxed').materialbox();

  $('#formSubmit').click(() => {
    submitForm();
  });

  addCards(cardList);

  $('.modal').modal();
});


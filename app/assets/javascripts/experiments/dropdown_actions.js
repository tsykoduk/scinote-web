(function(){

  // Create ajax hook on given 'element', which should return modal with 'id' =>
  // show that modal
  function initializeModal(element, id){

    // Initialize new experiment modal listener
    $(element)
    .on("ajax:beforeSend", function(){
      animateSpinner();
    })
    .on("ajax:success", function(e, data){
      $('body').append($.parseHTML(data.html));
      $(id).modal('show',{
        backdrop: true,
        keyboard: false,
      });
      validateMoveModal(id);
      clearModal($(id));
      reloadPageAfterUpdate($(id));
    })
    .on("ajax:error", function() {
      animateSpinner(null, false);
      // TODO
    })
    .on("ajax:complete", function(){
      animateSpinner(null, false);
    });
  }

  function clearModal(id) {
    //Completely remove modal when it gets closed
    $(id).on('hidden.bs.modal', function() {
      $(id).remove();
    });
  }

  // Initialize dropdown actions on experiment:
  // - edit
  // - clone
  function initializeDropdownActions(){
    // { buttonClass: modalName } mappings
    // click on buttonClass summons modalName dialog
    modals = {
      '.edit-experiment': '#edit-experiment-modal-',
      '.clone-experiment': '#clone-experiment-modal-',
      '.move-experiment': '#move-experiment-modal-'
    };

    $.each($(".dropdown-experiment-actions"), function(){
      var $dropdown = $(this);
      $.each(modals, function(buttonClass, modalName) {
        var id = modalName + $dropdown.data('id');
        initializeModal($dropdown.find(buttonClass), id);
      });
    });
  }

  // Validates move action
  function validateMoveModal(modal){
    if ( modal.match(/#move-experiment-modal-[0-9]*/) ) {
      var form = $(modal).find("form");
      form
      .on('ajax:success', function(e, data) {
        animateSpinner(form, true);
        window.location.replace(data.path);
      })
      .on('ajax:error', function(e, error) {
        var msg = JSON.parse(error.responseText);
        renderFormError(e,
                        form.find("#experiment_project_id"),
                        msg.message.toString());
      })
      .clearFormErrors();
    }
  }
  // Reload after successfully updated experiment
  function reloadPageAfterUpdate(element){
    if ( element ) {
      var form = element.find("form");
      form
      .on('ajax:success' , function(){
        animateSpinner(form, true);
        location.reload();
      });
    }
  }
  // Initialize no description edit link
  function initEditNoDescription(){
    var modal = "#edit-experiment-modal-";
    $.each($(".experiment-no-description a"), function(){
      var id = modal + $(this).data("id");
      initializeModal($(this), id);
    });
  }
  // Bind modal to new-experiment action
  initializeModal($("#new-experiment"), '#new-experiment-modal');

  // Bind modal to big-plus new experiment actions
  initializeModal('.big-plus', '#new-experiment-modal');

  // Bind modal to all actions listed on dropdown accesible from experiment
  // panel
  initializeDropdownActions();

  // init
  initEditNoDescription();
})();

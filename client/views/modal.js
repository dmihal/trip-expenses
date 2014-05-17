var _template = null, _context = null;
var modalDep = new Deps.Dependency();

Modal = {
  show : function (template, context) {
    _template = template;
    _context = context;
    modalDep.changed();
    $("#modalContainer").modal('show');
  }
};
Template.modal.rendered = function(){
  $("#modalContainer").modal({show:false});
};
Template.modal.content = function(){
  modalDep.depend();
  return _template;
};
Template.modal.context = function(){
  modalDep.depend();
  return _context;
};


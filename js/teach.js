function activatePopover(id) {
    let realId = '#' + id;
    $(realId).popover('show');
    $(realId).popover('disable');
}

function teach() {
    activatePopover("deletePoint");
}

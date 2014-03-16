var container = $('#video-preview');
var bg = chrome.extension.getBackgroundPage();
var ids = bg.ids;
for(var i = 0; i < ids.length; ++i) {
    var id = ids[i];
    var image = "<li><a href=\"https://www.youtube.com/watch?v="+id+"\" target=\"_blank\"><img src=\"http://img.youtube.com/vi/" + id + "/2.jpg\" /></a><input type=\"checkbox\" name=\"video-id\" value=\""+id+"\" class=\"video-checker\" checked></li>";
    container.append(image);
}

$('#submit-button').click(function() {
    var params = "?";
    $('[name="video-id"]:checked').each(function() {
        params += "id=" + $(this).val() + "&";
    });
    window.open('./popup_window.html' + params, null, 'width=500, height=320, menubar=no, toolbar=no, location=no');
});

$(".save").on("click", function (event) {
    var id = $(this).data("id");

    $(this)
        .parents(".card")
        .remove();

    $.ajax({
        url: "/save/" + id,
        method: "POST"
    }).then(function (data) {
        console.log(data);
    });
});

$(".note").on("click", function (event) {
    var id = $(this).data("id");
    console.log(id);
})

$(".delete").on("click", function (event) {
    var id = $(this).data("id");
    console.log(id);

    $(this)
        .parents(".card")
        .remove();

    $.ajax({
        url: "/delete/" + id,
        method: "DELETE"
    }).then(function (data) {
        console.log(data);
    });
})

$(".scrape").on("click", function (event) {
    $.ajax({
        url: "/scrape",
        method: "GET"
    }).then(function (data) {
        console.log(data);
    });
})

function __t(strings, ...values) {
  return strings.reduce(
    (acc, cur, i) => acc + cur + (i < values.length ? values[i] : ""),
    ""
  );
}
const html = __t,
  css = __t;

const rawStyle = css`
  body {
    max-width: 1200px;
    margin: 30px auto;
  }
  .form .pure-g {
    margin-bottom: 18px;
  }

  .form textarea {
    width: 95%;
    resize: vertical;
    min-height: 300px;
  }

  .msg-success {
    color: rgb(28, 184, 65);
  }
`;
$("html").append(`<style>${rawStyle}</style>`);

$("#root").html(html`
  <form class="pure-form form">
    <fieldset>
      <div class="pure-g">
        <div class="pure-u-2-3">
          <textarea type="text" placeholder="URLs"></textarea>
        </div>
      </div>

      <button type="submit" class="pure-button pure-button-primary">
        Save
      </button>
    </fieldset>
  </form>
`);

$.get("./api/tasks").done((res) => {
  $(".form textarea").val(res);
});

$(".form").on("submit", (e) => {
  e.preventDefault();

  $.post({
    url: "./api/tasks",
    data: {
      data: $(".form textarea")
        .val()
        .trim()
        .split("\n")
        .map((line) => line.trim())
        .filter((el) => el && /^https?:/.test(el))
        .join("\n"),
    },
  }).then((res) => {
    if (res !== "ok") {
      alert("Submit failed");
    } else {
      $("#root").append(html`<div class="msg-success">Succeeded~</div>`);

      setTimeout(() => {
        $(".msg-success").fadeOut();
      }, 1500);
    }
  });
});

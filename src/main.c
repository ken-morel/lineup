
#include "body.h"
#include "draw.h"
#include "gapi.h"
#include "line.h"
#include "user_points.h"
#include "utils.h"

void show_text_messages() {
  char txt[50];
  sprintf(txt, "loss: %.4lf", loss);
  gm_draw_text(0, 0.9, txt, "", 0.1, GM_WHITE);
}
void show_pointer_position() {
  if (selected_point == -1)
    show_position(gm_mouse.position.x, gm_mouse.position.y, GM_GRAY);
}
int main() {
  gm_init(500, 500, "floating lineup");
  gm_bg_color(GM_BLACK);
  gmBody play_button = gm_circle_body(0, 0.9, 0.9, 0.08);
  int autoplay = 0;

  do {
    if (gm_mouse.pressed && selected_point == -1) {

      if (gm_body_contains(&play_button, gm_mouse.position.x,
                           gm_mouse.position.y))
        autoplay = !autoplay;

      else
        add_user_point(gm_mouse.position.x, gm_mouse.position.y);
    } else if (gm_mouse.down) {
      if (selected_point >= 0)
        user_points[selected_point] = gm_mouse.position;
    } else {
      if (gm_key('d')) {
        delete_selected_point();
      } else if (gm_key(' ') || autoplay) {
        one_epoch();
      }
    }
    find_selected_point();

    gm_draw_circle_body(&play_button, autoplay ? GM_GREEN : GM_RED);

    show_pointer_position();
    show_selected_point_position();
    show_text_messages();
    plot_user_points();
    plot_line();
  } while (gm_yield());
  return 0;
}

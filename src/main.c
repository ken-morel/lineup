#include "gama.h"
#include "gridlines.h"
#include "line.h"
#include "user_points.h"
#include "utils.h"

void show_text_messages() {
  char txt[50];
  sprintf(txt, "loss: %.4lf", loss);
  gm_draw_text(0, 0.9, txt, "", 0.1, GM_WHITE);
  sprintf(txt, "y = %.3lfx + %.3lf", gradient, intercept);
  gm_draw_text(0, 0.8, txt, "", 0.1, GM_WHITE);
}
void show_pointer_position() {
  if (selected_point == -1)
    show_position(gm_mouse.position.x, gm_mouse.position.y, GM_GRAY);
}
int main() {
  gm_init(500, 500, "Lineup");
  gm_bg_color(GM_BLACK);
  gm_fullscreen(1);
  gmBody play_button = gm_circle_body(0, 0.9, 0.9, 0.05);
  int autoplay = 1;

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
    } else if (gm_key('d') || gm_key_pressed('s', 'd')) {
      delete_selected_point();
    }

    if (gm_key(' ') || autoplay) {
      one_epoch();
    }
    if (gm_key('a'))
      autoplay = !autoplay;

    if (gm_key('f'))
      learn_rate = 1;
    else
      learn_rate = 0.01;
    const double move_units = 0.01;
    if (gm_key('U'))
      move_points(0, move_units);
    else if (gm_key('D'))
      move_points(0, -move_units);
    else if (gm_key('L'))
      move_points(-move_units, 0);
    else if (gm_key('R'))
      move_points(move_units, 0);

    find_selected_point();

    draw_gridlines();

    gm_draw_text(0.70, 0.9, "auto(a)", "", 0.08, GM_WHITE);
    gm_draw_circle_body(&play_button, autoplay ? GM_GREEN : GM_RED);

    show_pointer_position();
    show_selected_point_position();
    show_text_messages();
    plot_user_points();
    plot_line();
  } while (gm_yield());
  return 0;
}

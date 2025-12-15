#include <stdlib.h>
#define MAX_USER_POINTS 50
#include "user_points.h"

#include "line.h"

void setup() {
  gm_init(500, 500, "floating lineup");
  gm_bg_color(GM_BLACK);

  srand(1);
}

void show_text_messages() {
  char txt[50];
  sprintf(txt, "loss: %.4lf", loss);
  gm_draw_text(0, 0.9, txt, "", 0.1, GM_WHITE);
}
int main() {
  setup();
  do {

    // gm_draw_line(-1, -1, 1, 1, 0.1, GM_BLUE);
    if (gm_mouse.pressed) {
      if (gm_key('a')) {
        add_user_point(gm_mouse.position.x, gm_mouse.position.y);
      } else if (gm_key('m')) {
        place_selected_point();
      } else if (gm_mouse.down) {
        find_selected_point();
      }
    } else {
      if (gm_key('d')) {
        delete_selected_point();
      } else if (gm_key(' ')) {
        one_epoch();
      }
    }

    show_text_messages();
    plot_user_points();
    plot_line();
  } while (gm_yield());
  return 0;
}

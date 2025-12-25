#define GM_SETUP

#include <gama.h>

gmBody rect;

int setup() {
  rect = gm_rectangle_body(1, 0, 0, 1, 1);
  rect.velocity.y = 0.1;
  gm_init(500, 500, "Gama web test");
  return 0;
}

int loop() {
  gm_body_update(&rect);
  gm_draw_line(-1, -1, 1, 1, 0.1, GM_BLUE);

  gm_draw_circle(gm_mouse.position.x, gm_mouse.position.y, 0.1, GM_ORANGERED);

  gm_draw_text(0, 0, "Hello world", "", 0.5, GM_CYAN);

  gm_draw_rect_body(&rect, GM_RED);

  gm_key('U');
  return 0;
}

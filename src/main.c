#include "color.h"
#define GM_SETUP

#include "gridlines.h"
#include "line.h"
#include "user_points.h"
#include "utils.h"
#include <gama.h>

char txt[50] = {0};

void show_text_messages() {
  sprintf(txt, "loss: %.4lf", loss);
  gm_draw_text(0, 0.9, txt, "", 0.1, GM_WHITE);
  sprintf(txt, "y = %.3lfx + %.3lf", gradient, intercept);
  gm_draw_text(0, 0.8, txt, "", 0.1, GM_WHITE);
}
void show_pointer_position() {
  if (selected_point == -1)
    show_position(gm_mouse.position.x, gm_mouse.position.y, GM_GRAY);
}

int autoplay;
double swanim;

gmPos joy = {0, 0}, joyv;

double learn_scaled, learn_anim;

int setup() {
  gm_init(800, 500, "Lineup");
  gm_background(0x222222FF);
  // gm_fullscreen(1);
  gm_show_fps(1);

  autoplay = 1;
  swanim = autoplay;

  joyv = joy;

  learn_scaled = sqrt(sqrt(learn_rate));
  learn_anim = learn_scaled;
  return 0;
}

int loop() {
  draw_gridlines();
  show_selected_point_position();
  show_text_messages();
  plot_user_points();
  plot_line();

  int controls_hovered = gmw_frame(1, 0.75, 0.45, 0.36);
  if (!controls_hovered)
    show_pointer_position();
  gmw_switch_anim(0.9, 0.85, 0.18, 0.09, &autoplay, &swanim);
  gm_draw_text(1.1, 0.85, "auto", "", 0.1, GM_WHITE);
  gmw_scale_anim(1, 0.75, 0.4, 0.02, &learn_scaled, &learn_anim);
  if (gmw_button(1, 0.65, 0.2, 0.08, "step", 0.1) && gm_mouse.down)
    one_epoch();
  learn_rate = pow(learn_scaled, 4);

  int joy_hovered = gm_joystick_anim(-1.18, 0.78, 0.2, &joy, &joyv);
  if (gm_mouse.pressed && selected_point == -1) {
    if (!controls_hovered && !joy_hovered)
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
  move_points(joy);

  if (gm_key('f'))
    learn_scaled += gm_key('S') ? -0.01 : 0.01;

  find_selected_point();
  if (gm_key_pressed('s', 'x'))
    gm_quit();
  return 0;
}

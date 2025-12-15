#pragma once
#include <gama.h>

void show_position(double x, double y, gmColor color) {
  char txt[50];
  sprintf(txt, "(%.2lf,%.2lf)", x, y);
  gm_draw_text(x, y, txt, "", 0.08, color);
}

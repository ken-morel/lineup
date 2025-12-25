#pragma once
#include <gama.h>

char label_txt[50] = "Hello world";

void show_position(double x, double y, gmColor color) {
  snprintf(label_txt, sizeof(label_txt), "(%.2lf,%.2lf)", x, y);
  gm_draw_text(x, y, label_txt, "", 0.08, color);
}

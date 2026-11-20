import { getMantriPN } from "../data/units";
import type {
  CharacterThemeConfig,
  CustomThemeAssets,
  Mantri,
  ReportState,
  UnitSettings,
} from "../types/report";
import {
  formatRupiah,
  getCustomerLoanValue,
  getIndonesianDate,
  getLoanDeb,
  getMantriDeb,
  getMantriTotal,
  parseNumber,
} from "./format";

interface ExportRow {
  nameLines: string[];
  osLines: string[][];
  height: number;
}

interface ExportPlan {
  mantri: Mantri;
  rows: ExportRow[];
  groupHeight: number;
}

function loadImageUrl(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function loadSvgImage(svgString: string): Promise<HTMLImageElement | null> {
  const encoded = encodeURIComponent(svgString)
    .replace(/%0A/g, "")
    .replace(/%20/g, " ");
  return loadImageUrl(`data:image/svg+xml;charset=utf-8,${encoded}`);
}

function makeVerticalGradient(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  colorTop: string,
  colorBot: string
): CanvasGradient {
  const g = ctx.createLinearGradient(x, y, x, y + height);
  g.addColorStop(0, colorTop);
  g.addColorStop(1, colorBot);
  return g;
}

function drawRoundedPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  points: number,
  fill: string,
  stroke?: string,
  rot = -Math.PI / 2
) {
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = rot + (i * Math.PI) / points;
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.stroke();
  }
  ctx.restore();
}

function drawSparkle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: string
) {
  drawStar(ctx, cx, cy, r, r * 0.28, 4, color, undefined, 0);
}

function drawBikiniFlower(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  strokeColor: string,
  rotDeg = 0
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((rotDeg * Math.PI) / 180);
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 3.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const petals = 5;
  for (let i = 0; i < petals; i++) {
    const a1 = (i * 2 * Math.PI) / petals - Math.PI / 2;
    const aMid = a1 + Math.PI / petals;
    const rIn = size * 0.34;
    const rOut = size;
    const x1 = Math.cos(a1) * rIn;
    const y1 = Math.sin(a1) * rIn;
    const ctrlX = Math.cos(aMid) * rOut * 1.35;
    const ctrlY = Math.sin(aMid) * rOut * 1.35;
    const a2 = ((i + 1) * 2 * Math.PI) / petals - Math.PI / 2;
    const x2 = Math.cos(a2) * rIn;
    const y2 = Math.sin(a2) * rIn;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(ctrlX, ctrlY, x2, y2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.26, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawBubble(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  strokeColor: string
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.38)";
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2.4;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx - r * 0.35, cy - r * 0.35, r * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fill();
  ctx.restore();
}

function drawLightningBolt(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  fill: string,
  stroke: string
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.moveTo(4, -22);
  ctx.lineTo(-10, 2);
  ctx.lineTo(1, 2);
  ctx.lineTo(-5, 22);
  ctx.lineTo(12, -3);
  ctx.lineTo(1, -3);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2.2;
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.restore();
}

function drawCloud(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.strokeStyle = "#8AC7F0";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(-18, 6, 14, Math.PI * 0.5, Math.PI * 1.5);
  ctx.arc(-4, -8, 17, Math.PI, Math.PI * 2);
  ctx.arc(16, 4, 15, Math.PI * 1.5, Math.PI * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawAmbientMotifs(
  ctx: CanvasRenderingContext2D,
  theme: CharacterThemeConfig,
  x: number,
  y: number,
  w: number,
  h: number
) {
  // Subtle halftone dots on left and right edges
  ctx.save();
  ctx.fillStyle = theme.bannerDotColor;
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 10; col++) {
      const r = Math.max(1.5, 4 - col * 0.35);
      ctx.beginPath();
      ctx.arc(x + 28 + col * 24, y + 26 + row * 28, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + w - 28 - col * 24, y + 26 + row * 28, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  if (theme.id === "spongebob") {
    drawBikiniFlower(ctx, x + 70, y + 84, 34, "rgba(235, 168, 0, 0.45)", -15);
    drawBikiniFlower(ctx, x + w - 420, y + 48, 28, "rgba(225, 118, 20, 0.55)", 12);
    drawBikiniFlower(ctx, x + w - 120, y + 66, 40, "rgba(225, 145, 0, 0.45)", 22);
    drawBubble(ctx, x + 150, y + 48, 18, "rgba(220, 170, 0, 0.48)");
    drawBubble(ctx, x + 365, y + 128, 14, "rgba(220, 170, 0, 0.45)");
    drawBubble(ctx, x + 392, y + 145, 9, "rgba(220, 170, 0, 0.45)");
    drawBubble(ctx, x + w - 260, y + 44, 16, "rgba(220, 170, 0, 0.42)");
  } else if (theme.id === "woody") {
    drawStar(ctx, x + 95, y + 72, 22, 10, 5, "#FFAC1C", "#D67A00", -0.35);
    drawStar(ctx, x + w - 260, y + 44, 16, 7.5, 5, "#FFBF24", "#D67A00", -0.2);
    drawStar(ctx, x + w - 70, y + 66, 22, 10, 5, "#FFAC1C", "#D67A00", 0.2);
    drawSparkle(ctx, x + 65, y + 132, 14, "#F5B700");
    drawSparkle(ctx, x + w - 140, y + 76, 15, "#F5B700");
  } else if (theme.id === "pikachu") {
    drawLightningBolt(ctx, x + 84, y + 76, 1.35, "#FFE124", "#D47A00");
    drawLightningBolt(ctx, x + w - 90, y + 72, 1.25, "#FFE124", "#D47A00");
    drawSparkle(ctx, x + w - 250, y + 48, 16, "#F59E0B");
    drawSparkle(ctx, x + 405, y + 42, 12, "#F59E0B");
  } else if (theme.id === "doraemon") {
    drawCloud(ctx, x + 90, y + 68, 1.15);
    drawCloud(ctx, x + w - 120, y + 66, 1.2);
    drawStar(ctx, x + w - 270, y + 42, 13, 6, 5, "#FFD426", "#D48800");
    drawSparkle(ctx, x + 410, y + 44, 13, "#38BDF8");
  }
}

function getExportColumns(state: ReportState): number[] {
  const measure = document.createElement("canvas").getContext("2d");
  const textWidth = (text: string, font = "900 28px 'Plus Jakarta Sans', Arial") => {
    if (!measure) return String(text || "").length * 16;
    measure.font = font;
    return Math.ceil(measure.measureText(String(text || "")).width);
  };

  const columns: number[] = [];
  columns.push(78); // No

  const mantriWidth = Math.max(
    210,
    ...state.mantri.map((mantri) => {
      const nameW = textWidth(mantri.name, "900 28px 'Plus Jakarta Sans', Arial") + 48;
      const pn = getMantriPN(mantri.name);
      const pnW = pn ? textWidth("PN " + pn, "700 21px 'Plus Jakarta Sans', Arial") + 48 : 0;
      return Math.max(nameW, pnW);
    })
  );
  columns.push(mantriWidth);

  const customerNames = state.mantri.flatMap((mantri) =>
    mantri.customers.map((customer) => customer.name || "-")
  );
  const customerWidth = Math.max(
    280,
    ...customerNames.map((name) => textWidth(name, "800 26px 'Plus Jakarta Sans', Arial") + 54)
  );
  columns.push(customerWidth);

  state.loans.forEach((loan) => {
    columns.push(105); // DEB
    const values = state.mantri.flatMap((mantri) =>
      mantri.customers.map((customer) => {
        const value = getCustomerLoanValue(customer, loan);
        return value ? formatRupiah(value) : "";
      })
    );
    const osWidth = Math.max(
      215,
      textWidth(loan, "900 26px 'Plus Jakarta Sans', Arial") + 48,
      ...values.map((v) => textWidth(v, "900 26px 'Plus Jakarta Sans', Arial") + 48)
    );
    columns.push(osWidth);
  });

  const totalWidth = Math.max(
    210,
    ...state.mantri.map(
      (mantri) =>
        textWidth(formatRupiah(getMantriTotal(mantri, state.loans)), "900 28px 'Plus Jakarta Sans', Arial") +
        48
    )
  );
  columns.push(totalWidth);

  const grandDeb = state.mantri.reduce(
    (sum, mantri) => sum + getMantriDeb(mantri, state.loans),
    0
  );
  const maxDebWidth = Math.max(
    260,
    textWidth(`TOTAL DEB ${grandDeb}`, "900 34px 'Plus Jakarta Sans', Arial") + 110
  );
  columns.push(maxDebWidth);

  columns.push(190); // AMKKM
  columns.push(190); // BRINS

  (state.dhColumns || []).forEach((dhName, dhIdx) => {
    const dhTotal = state.mantri.reduce((sum, mantri) => {
      const raw = Array.isArray(mantri.dhValues) ? mantri.dhValues[dhIdx] : "";
      return sum + (raw !== undefined && raw !== "" ? parseNumber(String(raw)) : 0);
    }, 0);
    const totalTextW =
      textWidth(dhTotal ? formatRupiah(dhTotal) : "—", "900 32px 'Plus Jakarta Sans', Arial") + 56;
    const nameW = textWidth(dhName, "900 26px 'Plus Jakarta Sans', Arial") + 56;
    const dhValW = Math.max(
      0,
      ...state.mantri.map((mantri) => {
        const raw = Array.isArray(mantri.dhValues) ? mantri.dhValues[dhIdx] : "";
        const n = raw !== "" && raw !== undefined ? parseNumber(String(raw)) : 0;
        return n ? textWidth(formatRupiah(n), "900 28px 'Plus Jakarta Sans', Arial") + 48 : 0;
      })
    );
    columns.push(Math.max(210, totalTextW, nameW, dhValW));
  });

  return columns;
}

function buildExportPlans(state: ReportState): ExportPlan[] {
  return state.mantri.map((mantri) => {
    const customers = mantri.customers.length
      ? mantri.customers
      : [{ name: "-", loans: {}, empty: true }];
    const rows: ExportRow[] = customers.map((customer) => {
      const nameLines = [customer.empty ? "-" : customer.name || "-"];
      const osLines = state.loans.map((loan) => {
        if (customer.empty) return ["-"];
        const value = getCustomerLoanValue(customer, loan);
        return [value ? formatRupiah(value) : ""];
      });
      return { nameLines, osLines, height: 82 };
    });
    return {
      mantri,
      rows,
      groupHeight: rows.reduce((sum, row) => sum + row.height, 0),
    };
  });
}

function strokeRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, Math.round(w), Math.round(h));
}

function drawCenteredLines(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  width: number,
  height: number,
  lineHeight: number
) {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const startY = y + height / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) =>
    ctx.fillText(line, x + width / 2, startY + index * lineHeight)
  );
}

function drawHeadCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  lines: string[],
  theme: CharacterThemeConfig
) {
  strokeRect(ctx, x, y, width, height, theme.tableLine);
  ctx.fillStyle = theme.tableHeadText;
  ctx.font = "800 27px 'Plus Jakarta Sans', Arial, sans-serif";
  drawCenteredLines(ctx, lines, x, y, width, height, 32);
}

function drawGroupCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  text: string,
  badge: boolean,
  theme: CharacterThemeConfig
) {
  strokeRect(ctx, x, y, width, height, theme.tableLine);
  if (badge) {
    const bx = x + width / 2 - 26;
    const by = y + height / 2 - 28;
    ctx.fillStyle = makeVerticalGradient(
      ctx,
      bx,
      by,
      52,
      56,
      theme.badgeBgStart,
      theme.badgeBgEnd
    );
    drawRoundedPath(ctx, bx, by, 52, 56, 9);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 38px 'Plus Jakarta Sans', Arial, sans-serif";
    drawCenteredLines(ctx, [text], x, y, width, height, 40);
    return;
  }

  const pn = getMantriPN(text);
  if (pn) {
    const midY = y + height / 2;
    ctx.fillStyle = theme.inkPrimary;
    ctx.font = "800 28px 'Plus Jakarta Sans', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + width / 2, midY - 16);
    ctx.fillStyle = theme.inkMuted;
    ctx.font = "700 21px 'Plus Jakarta Sans', Arial, sans-serif";
    ctx.fillText("PN " + pn, x + width / 2, midY + 18);
    return;
  }

  ctx.fillStyle = theme.inkPrimary;
  ctx.font = "800 28px 'Plus Jakarta Sans', Arial, sans-serif";
  drawCenteredLines(ctx, [text], x, y, width, height, 34);
}

function drawTextCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  lines: string[],
  theme: CharacterThemeConfig
) {
  strokeRect(ctx, x, y, width, height, theme.tableLine);
  ctx.fillStyle = theme.inkPrimary;
  ctx.font = "800 26px 'Plus Jakarta Sans', Arial, sans-serif";
  drawCenteredLines(ctx, lines, x, y, width, height, 32);
}

export async function generateReportPngDataUrl(
  state: ReportState,
  theme: CharacterThemeConfig,
  unitSettings: UnitSettings,
  showDate: boolean,
  customAssets?: CustomThemeAssets
): Promise<{ dataUrl: string; filename: string }> {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const charSrc = customAssets?.characterDataUrl || theme.characterPngUrl;
  const bgSrc = customAssets?.backgroundDataUrl || theme.backgroundPngUrl;

  const [loadedCharImg, loadedBgImg] = await Promise.all([
    loadImageUrl(charSrc),
    loadImageUrl(bgSrc),
  ]);
  const charImg = loadedCharImg || (await loadSvgImage(theme.characterSvg));
  const plans = buildExportPlans(state);
  const columns = getExportColumns(state);
  const tableWidth = columns.reduce((sum, w) => sum + w, 0);

  const outerPad = 24;
  const cardPad = 14;
  const bannerHeight = 178;
  const headerTop = 74;
  const headerSub = 64;
  const bodyHeight = plans.reduce((sum, p) => sum + p.groupHeight, 0);
  const footerHeight = 90;
  const tableHeight = headerTop + headerSub + bodyHeight + footerHeight;

  const cardWidth = Math.max(1680, tableWidth + cardPad * 2);
  const cardHeight = bannerHeight + tableHeight + cardPad;
  const width = cardWidth + outerPad * 2;
  const height = cardHeight + outerPad * 2;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");

  // Outer white backdrop
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  const cardX = outerPad;
  const cardY = outerPad;

  // Card clip + white fill
  ctx.save();
  drawRoundedPath(ctx, cardX, cardY, cardWidth, cardHeight, 26);
  ctx.clip();

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(cardX, cardY, cardWidth, cardHeight);

  // Banner background (manual/static PNG or gradient fallback)
  ctx.fillStyle = makeVerticalGradient(
    ctx,
    cardX,
    cardY,
    cardWidth,
    bannerHeight,
    theme.bannerBgStart,
    theme.bannerBgEnd
  );
  ctx.fillRect(cardX, cardY, cardWidth, bannerHeight);

  if (loadedBgImg) {
    // Draw cover-fitted background image
    const imgRatio = loadedBgImg.width / Math.max(1, loadedBgImg.height);
    const boxRatio = cardWidth / bannerHeight;
    let drawW = cardWidth;
    let drawH = bannerHeight;
    let drawX = cardX;
    let drawY = cardY;
    if (imgRatio > boxRatio) {
      drawH = bannerHeight;
      drawW = bannerHeight * imgRatio;
      drawX = cardX + (cardWidth - drawW) / 2;
    } else {
      drawW = cardWidth;
      drawH = cardWidth / imgRatio;
      drawY = cardY + (bannerHeight - drawH) / 2;
    }
    ctx.drawImage(loadedBgImg, drawX, drawY, drawW, drawH);
  }

  // Ambient motifs in banner (only if not using a custom uploaded background)
  if (!customAssets?.backgroundDataUrl) {
    drawAmbientMotifs(ctx, theme, cardX, cardY, cardWidth, bannerHeight);
  }

  // Character illustration on left side, resting right on top of the table border
  if (charImg) {
    const maxH = 172;
    const ratio = charImg.width / Math.max(1, charImg.height);
    const imgH = maxH;
    const imgW = Math.min(260, imgH * ratio);
    ctx.drawImage(charImg, cardX + 115, cardY + bannerHeight - imgH + 4, imgW, imgH);
  }

  // Unit title in center with thick white outline + gradient fill
  const titleText = (state.title || "MARGASARI").toUpperCase();
  const titleX = cardX + cardWidth / 2 + 24;
  const titleY = cardY + bannerHeight / 2 + 2;
  ctx.save();
  ctx.font = "700 84px 'Fredoka', 'Arial Rounded MT Bold', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.miterLimit = 2;

  // Shadow behind outline
  ctx.shadowColor = theme.titleShadow;
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 5;
  ctx.strokeStyle = theme.titleStroke;
  ctx.lineWidth = 18;
  ctx.strokeText(titleText, titleX, titleY);

  // Clear shadow for crisp fill
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  const titleGrad = makeVerticalGradient(
    ctx,
    titleX,
    titleY - 40,
    10,
    80,
    theme.titleFillTop,
    theme.titleFillBottom
  );
  ctx.fillStyle = titleGrad;
  ctx.fillText(titleText, titleX, titleY);
  ctx.restore();

  // Date pill on right side of banner
  if (showDate) {
    const dateStr = getIndonesianDate();
    ctx.save();
    ctx.font = "700 26px 'Plus Jakarta Sans', Arial, sans-serif";
    const textW = ctx.measureText(dateStr).width;
    const pillW = textW + 52;
    const pillH = 52;
    const pillX = cardX + cardWidth - pillW - 36;
    const pillY = cardY + bannerHeight - pillH - 28;

    ctx.fillStyle = "#ffffff";
    drawRoundedPath(ctx, pillX, pillY, pillW, pillH, 26);
    ctx.fill();
    ctx.strokeStyle = theme.dateBorder;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = theme.dateText;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(dateStr, pillX + pillW / 2, pillY + pillH / 2 + 1);
    ctx.restore();
  }

  // Table coordinates
  const tableX = Math.round(cardX + (cardWidth - tableWidth) / 2);
  const tableY = cardY + bannerHeight;

  // Table Header
  ctx.fillStyle = makeVerticalGradient(
    ctx,
    tableX,
    tableY,
    tableWidth,
    headerTop + headerSub,
    theme.tableHeadStart,
    theme.tableHeadEnd
  );
  ctx.fillRect(tableX, tableY, tableWidth, headerTop + headerSub);

  let cx = tableX;
  drawHeadCell(ctx, cx, tableY, columns[0], headerTop + headerSub, ["No"], theme);
  cx += columns[0];
  drawHeadCell(ctx, cx, tableY, columns[1], headerTop + headerSub, ["Mantri"], theme);
  cx += columns[1];
  drawHeadCell(
    ctx,
    cx,
    tableY,
    columns[2],
    headerTop + headerSub,
    ["Nama", "Nasabah"],
    theme
  );
  cx += columns[2];

  state.loans.forEach((loan, idx) => {
    const debW = columns[3 + idx * 2];
    const osW = columns[4 + idx * 2];
    drawHeadCell(ctx, cx, tableY, debW + osW, headerTop, [loan], theme);
    drawHeadCell(ctx, cx, tableY + headerTop, debW, headerSub, ["DEB"], theme);
    drawHeadCell(ctx, cx + debW, tableY + headerTop, osW, headerSub, ["OS"], theme);
    cx += debW + osW;
  });

  const totalIndex = 3 + state.loans.length * 2;
  drawHeadCell(
    ctx,
    cx,
    tableY,
    columns[totalIndex],
    headerTop + headerSub,
    ["Total", "OS"],
    theme
  );
  cx += columns[totalIndex];
  drawHeadCell(
    ctx,
    cx,
    tableY,
    columns[totalIndex + 1],
    headerTop + headerSub,
    ["Total", "DEB"],
    theme
  );
  cx += columns[totalIndex + 1];
  drawHeadCell(
    ctx,
    cx,
    tableY,
    columns[totalIndex + 2],
    headerTop + headerSub,
    ["AMKKM"],
    theme
  );
  cx += columns[totalIndex + 2];
  drawHeadCell(
    ctx,
    cx,
    tableY,
    columns[totalIndex + 3],
    headerTop + headerSub,
    ["BRINS"],
    theme
  );
  cx += columns[totalIndex + 3];

  (state.dhColumns || []).forEach((dhName, dhIdx) => {
    drawHeadCell(
      ctx,
      cx,
      tableY,
      columns[totalIndex + 4 + dhIdx],
      headerTop + headerSub,
      [dhName],
      theme
    );
    cx += columns[totalIndex + 4 + dhIdx];
  });

  // Table Body
  let cy = tableY + headerTop + headerSub;
  let grandTotal = 0;
  let grandDeb = 0;

  plans.forEach((plan, mantriIndex) => {
    const mantriTotal = getMantriTotal(plan.mantri, state.loans);
    const mantriDeb = getMantriDeb(plan.mantri, state.loans);
    const amkkmAuto = mantriDeb * (unitSettings.amkkm || 0);
    const brinsAuto = mantriDeb * (unitSettings.brins || 0);
    grandTotal += mantriTotal;
    grandDeb += mantriDeb;

    const gy = cy;
    const gh = plan.groupHeight;
    ctx.fillStyle = mantriIndex % 2 === 0 ? "#ffffff" : theme.rowAltBg;
    ctx.fillRect(tableX, gy, tableWidth, gh);

    let gcx = tableX;
    drawGroupCell(ctx, gcx, gy, columns[0], gh, String(mantriIndex + 1), true, theme);
    gcx += columns[0];
    drawGroupCell(
      ctx,
      gcx,
      gy,
      columns[1],
      gh,
      plan.mantri.name || "-",
      false,
      theme
    );
    gcx += columns[1];

    plan.rows.forEach((row) => {
      let rowX = gcx;
      drawTextCell(ctx, rowX, cy, columns[2], row.height, row.nameLines, theme);
      rowX += columns[2];

      state.loans.forEach((loan, loanIdx) => {
        if (cy === gy) {
          const debVal = getLoanDeb(plan.mantri, loan);
          drawGroupCell(
            ctx,
            rowX,
            gy,
            columns[3 + loanIdx * 2],
            gh,
            debVal ? String(debVal) : "",
            false,
            theme
          );
        }
        rowX += columns[3 + loanIdx * 2];
        drawTextCell(
          ctx,
          rowX,
          cy,
          columns[4 + loanIdx * 2],
          row.height,
          row.osLines[loanIdx],
          theme
        );
        rowX += columns[4 + loanIdx * 2];
      });
      cy += row.height;
    });

    gcx =
      tableX +
      columns[0] +
      columns[1] +
      columns[2] +
      state.loans.reduce(
        (sum, _, idx) => sum + columns[3 + idx * 2] + columns[4 + idx * 2],
        0
      );

    drawGroupCell(
      ctx,
      gcx,
      gy,
      columns[totalIndex],
      gh,
      mantriTotal ? formatRupiah(mantriTotal) : "",
      false,
      theme
    );
    gcx += columns[totalIndex];

    drawGroupCell(
      ctx,
      gcx,
      gy,
      columns[totalIndex + 1],
      gh,
      mantriDeb ? String(mantriDeb) : "",
      false,
      theme
    );
    gcx += columns[totalIndex + 1];

    const amkkmVal =
      plan.mantri.amkkmOverride !== undefined ? plan.mantri.amkkmOverride : amkkmAuto;
    const brinsVal =
      plan.mantri.brinsOverride !== undefined ? plan.mantri.brinsOverride : brinsAuto;

    drawGroupCell(
      ctx,
      gcx,
      gy,
      columns[totalIndex + 2],
      gh,
      amkkmVal ? formatRupiah(amkkmVal) : "",
      false,
      theme
    );
    gcx += columns[totalIndex + 2];

    drawGroupCell(
      ctx,
      gcx,
      gy,
      columns[totalIndex + 3],
      gh,
      brinsVal ? formatRupiah(brinsVal) : "",
      false,
      theme
    );
    gcx += columns[totalIndex + 3];

    (state.dhColumns || []).forEach((_, dhIdx) => {
      const dhRaw = Array.isArray(plan.mantri.dhValues)
        ? plan.mantri.dhValues[dhIdx] || ""
        : "";
      const dhNum = dhRaw !== "" ? parseNumber(String(dhRaw)) : 0;
      drawGroupCell(
        ctx,
        gcx,
        gy,
        columns[totalIndex + 4 + dhIdx],
        gh,
        dhNum ? formatRupiah(dhNum) : "",
        false,
        theme
      );
      gcx += columns[totalIndex + 4 + dhIdx];
    });
  });

  // Table Footer
  const dhTotals = (state.dhColumns || []).map((_, dhIdx) =>
    state.mantri.reduce((sum, mantri) => {
      const raw = Array.isArray(mantri.dhValues) ? mantri.dhValues[dhIdx] : "";
      return sum + (raw !== undefined && raw !== "" ? parseNumber(String(raw)) : 0);
    }, 0)
  );

  ctx.fillStyle = makeVerticalGradient(
    ctx,
    tableX,
    cy,
    tableWidth,
    footerHeight,
    theme.footBgStart,
    theme.footBgEnd
  );
  ctx.fillRect(tableX, cy, tableWidth, footerHeight);

  const beforeTotalW = columns.slice(0, totalIndex).reduce((sum, w) => sum + w, 0);
  const realisasiW = beforeTotalW + columns[totalIndex];
  const totalDebX = tableX + realisasiW;
  const amkkmX = totalDebX + columns[totalIndex + 1];
  const brinsX = amkkmX + columns[totalIndex + 2];
  let dhStartX = brinsX + columns[totalIndex + 3];

  strokeRect(ctx, tableX, cy, realisasiW, footerHeight, theme.tableLine);

  // Checkmark circle
  const checkX = tableX + 54;
  const checkY = cy + footerHeight / 2;
  ctx.fillStyle = makeVerticalGradient(
    ctx,
    checkX - 28,
    checkY - 28,
    56,
    56,
    theme.badgeBgStart,
    theme.badgeBgEnd
  );
  ctx.beginPath();
  ctx.arc(checkX, checkY, 27, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 30px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("✓", checkX, checkY + 2);

  // TOTAL REALISASI label & value
  ctx.fillStyle = theme.inkPrimary;
  ctx.textAlign = "left";
  ctx.font = "900 32px 'Plus Jakarta Sans', Arial, sans-serif";
  const totalLabel = "TOTAL REALISASI";
  ctx.fillText(totalLabel, tableX + 96, checkY + 1);
  const labelW = ctx.measureText(totalLabel).width;
  ctx.fillStyle = theme.footAccent;
  ctx.font = "900 40px 'Plus Jakarta Sans', Arial, sans-serif";
  ctx.fillText(formatRupiah(grandTotal), tableX + 96 + labelW + 34, checkY + 1);

  // TOTAL DEB cell
  const totalDebColSpanW = columns[totalIndex + 1] + columns[totalIndex + 2] + columns[totalIndex + 3];
  strokeRect(ctx, totalDebX, cy, totalDebColSpanW, footerHeight, theme.tableLine);

  const debText = "TOTAL DEB";
  const debVal = String(grandDeb);
  ctx.font = "900 28px 'Plus Jakarta Sans', Arial, sans-serif";
  const debLabelW = ctx.measureText(debText).width;
  ctx.font = "900 40px 'Plus Jakarta Sans', Arial, sans-serif";
  const debValW = ctx.measureText(debVal).width;
  const iconSize = 46;
  const gap = 14;
  const groupW = iconSize + gap + debLabelW + gap + debValW;
  const groupStartX = totalDebX + Math.max(24, (totalDebColSpanW - groupW) / 2);
  const dCircleX = groupStartX + iconSize / 2;

  ctx.fillStyle = makeVerticalGradient(
    ctx,
    dCircleX - 23,
    checkY - 23,
    46,
    46,
    theme.badgeBgStart,
    theme.badgeBgEnd
  );
  ctx.beginPath();
  ctx.arc(dCircleX, checkY, 23, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 24px 'Plus Jakarta Sans', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("D", dCircleX, checkY + 1);

  ctx.fillStyle = theme.inkPrimary;
  ctx.textAlign = "left";
  ctx.font = "900 28px 'Plus Jakarta Sans', Arial, sans-serif";
  ctx.fillText(debText, groupStartX + iconSize + gap, checkY + 1);
  ctx.fillStyle = theme.footAccent;
  ctx.font = "900 40px 'Plus Jakarta Sans', Arial, sans-serif";
  ctx.fillText(debVal, groupStartX + iconSize + gap + debLabelW + gap, checkY + 1);

  // TOTAL DH cells
  (state.dhColumns || []).forEach((_, dhIdx) => {
    const colW = columns[totalIndex + 4 + dhIdx];
    strokeRect(ctx, dhStartX, cy, colW, footerHeight, theme.tableLine);
    const total = dhTotals[dhIdx];

    ctx.fillStyle = theme.inkMuted;
    ctx.font = "700 18px 'Plus Jakarta Sans', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("TOTAL DH", dhStartX + colW / 2, checkY - 17);

    ctx.fillStyle = theme.footAccent;
    ctx.font = "900 30px 'Plus Jakarta Sans', Arial, sans-serif";
    ctx.fillText(total ? formatRupiah(total) : "—", dhStartX + colW / 2, checkY + 15);
    dhStartX += colW;
  });

  // Outer card rounded border stroke
  ctx.restore();
  drawRoundedPath(ctx, cardX, cardY, cardWidth, cardHeight, 26);
  ctx.strokeStyle = theme.frameBorder;
  ctx.lineWidth = 6;
  ctx.stroke();

  const filename =
    "laporan-" +
    (state.title || "margasari").toLowerCase().replace(/[^a-z0-9]+/g, "-") +
    ".png";
  const dataUrl = canvas.toDataURL("image/png");
  return { dataUrl, filename };
}

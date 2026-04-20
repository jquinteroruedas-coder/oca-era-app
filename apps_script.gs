// ============================================
// Google Apps Script - Reportes La Ocanera
// Pegar en Google Sheets: Extensiones > Apps Script
// Luego: Implementar > Nueva implementacion > Tipo: App web > Acceso: Cualquier usuario
// ============================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ts = new Date();

    // ======== Accion especial: recibir traslado pendiente ========
    if(data.action === "recibir" && data.id){
      const tr = ss.getSheetByName("Traslados");
      if(!tr) return _json({ok:false, error:"No hay hoja Traslados"});
      const rng = tr.getDataRange().getValues();
      const headers = rng[0];
      const idCol = headers.indexOf("ID");
      const estCol = headers.indexOf("Estado");
      const recCol = headers.indexOf("Cantidad recibida");
      const difCol = headers.indexOf("Diferencia");
      const opRecCol = headers.indexOf("Operario recibe");
      const fRecCol = headers.indexOf("Fecha recibe");
      const comRecCol = headers.indexOf("Comentario recibe");
      const cantCol = headers.indexOf("Cantidad");
      if(idCol < 0) return _json({ok:false, error:"Columnas viejas, reenvia un traslado primero"});
      for(let i=1;i<rng.length;i++){
        if(String(rng[i][idCol]) === String(data.id)){
          const cantOrig = parseFloat(rng[i][cantCol])||0;
          const cantRec = parseFloat(data.cantidadRecibida)||0;
          const dif = cantRec - cantOrig;
          const row = i+1;
          tr.getRange(row, estCol+1).setValue("Recibido");
          tr.getRange(row, recCol+1).setValue(cantRec);
          tr.getRange(row, difCol+1).setValue(dif);
          tr.getRange(row, opRecCol+1).setValue(data.operario||"");
          tr.getRange(row, fRecCol+1).setValue(ts);
          tr.getRange(row, comRecCol+1).setValue(data.comentario||"");
          // Resaltar fila con diferencia
          if(dif !== 0){
            tr.getRange(row, 1, 1, headers.length).setBackground("#FFF3C8");
          } else {
            tr.getRange(row, 1, 1, headers.length).setBackground("#E7F6EC");
          }
          return _json({ok:true, mensaje:"Recibo confirmado", diferencia:dif});
        }
      }
      return _json({ok:false, error:"No se encontro el traslado con ID "+data.id});
    }


    // Hoja RESUMEN (una fila por reporte)
    let resumen = ss.getSheetByName("Resumen");
    if(!resumen){
      resumen = ss.insertSheet("Resumen");
      resumen.appendRow(["Fecha envio","Bodega","Fecha reporte","Operario","Lote","Productos","Traslados","Insumos dañados","Defectos","Perdidas","Observaciones"]);
      resumen.getRange("A1:K1").setFontWeight("bold").setBackground("#BC3440").setFontColor("#ffffff");
    }
    resumen.appendRow([ts, data.bodega, data.fecha, data.operario, data.lote,
      (data.productos||[]).length,
      (data.traslados||[]).length,
      (data.insumosDanados||[]).length,
      (data.defectuosos||[]).length,
      (data.perdidas||[]).length,
      data.observaciones || ""]);

    // Hoja DETALLE por bodega (una fila por producto)
    const sheetName = "Detalle_" + data.bodega;
    let detalle = ss.getSheetByName(sheetName);
    if(!detalle){
      detalle = ss.insertSheet(sheetName);
      const headers = ["Fecha envio","Fecha reporte","Operario","Lote","SKU","Producto","Grupo","Unds/Caja"];
      data.columnas.forEach(function(c){ headers.push(c.charAt(0).toUpperCase()+c.slice(1)); });
      headers.push("Observaciones");
      detalle.appendRow(headers);
      detalle.getRange(1,1,1,headers.length).setFontWeight("bold").setBackground("#375090").setFontColor("#ffffff");
    }
    data.productos.forEach(function(p){
      const row = [ts, data.fecha, data.operario, data.lote, p.sku, p.nombre, p.grupo, p.unds];
      data.columnas.forEach(function(c){ row.push(p[c] || 0); });
      row.push(data.observaciones || "");
      detalle.appendRow(row);
    });

    // Hoja MATERIA PRIMA (solo Casona)
    if(data.materiaPrima && data.materiaPrima.length > 0){
      let mp = ss.getSheetByName("Materia_Prima");
      if(!mp){
        mp = ss.insertSheet("Materia_Prima");
        mp.appendRow(["Fecha envio","Fecha reporte","Operario","Lote","Bodega","Insumo","Kilos","Precio/kg","Subtotal"]);
        mp.getRange("A1:I1").setFontWeight("bold").setBackground("#54A07F").setFontColor("#ffffff");
      }
      data.materiaPrima.forEach(function(m){
        mp.appendRow([ts, data.fecha, data.operario, data.lote, data.bodega, m.nombre, m.kg, m.precio, m.subtotal]);
      });
    }

    // Hoja TRASLADOS
    if(data.traslados && data.traslados.length > 0){
      let tr = ss.getSheetByName("Traslados");
      if(!tr){
        tr = ss.insertSheet("Traslados");
        tr.appendRow(["Fecha envio","NT","Fecha reporte","Operario","Lote reporte","Bodega origen","Origen","Destino","SKU","Producto","Cantidad","Unidad","Estado producto","Lote traslado","Motivo","Comentarios","ID","Estado","Cantidad recibida","Diferencia","Operario recibe","Fecha recibe","Comentario recibe"]);
        tr.getRange("A1:W1").setFontWeight("bold").setBackground("#375090").setFontColor("#ffffff");
      }
      data.traslados.forEach(function(t){
        tr.appendRow([ts, t.nt||"", data.fecha, data.operario, data.lote, data.bodega, t.origen, t.destino, t.sku||"", t.producto||"", t.cantidad||0, t.unidad||"unds", t.estadoProd||"", t.lote||"", t.motivo||"", t.comentarios||"", t.id||"", "Pendiente", 0, 0, "", "", ""]);
      });
    }

    // Hoja INSUMOS DAÑADOS
    if(data.insumosDanados && data.insumosDanados.length > 0){
      let ins = ss.getSheetByName("InsumosDaniados");
      if(!ins){
        ins = ss.insertSheet("InsumosDaniados");
        ins.appendRow(["Fecha envio","Fecha reporte","Operario","Lote","Bodega","Insumo","Codigo","Cantidad","Unidad","Comentarios"]);
        ins.getRange("A1:J1").setFontWeight("bold").setBackground("#F7C93C").setFontColor("#373435");
      }
      data.insumosDanados.forEach(function(i){
        ins.appendRow([ts, data.fecha, data.operario, data.lote, data.bodega, i.tipo||"", i.codigo||"", i.cantidad||0, i.unidad||"und", i.comentarios||""]);
      });
    }

    // Hoja DEFECTUOSOS
    if(data.defectuosos && data.defectuosos.length > 0){
      let de = ss.getSheetByName("Defectuosos");
      if(!de){
        de = ss.insertSheet("Defectuosos");
        de.appendRow(["Fecha envio","Fecha reporte","Operario","Lote","Bodega","SKU","Producto","Cantidad","Motivo","Comentarios"]);
        de.getRange("A1:J1").setFontWeight("bold").setBackground("#BC3440").setFontColor("#ffffff");
      }
      data.defectuosos.forEach(function(d){
        de.appendRow([ts, data.fecha, data.operario, data.lote, data.bodega, d.sku||"", d.producto||"", d.cantidad||0, d.motivo||"", d.comentarios||""]);
      });
    }

    // Hoja PERDIDAS
    if(data.perdidas && data.perdidas.length > 0){
      let pe = ss.getSheetByName("Perdidas");
      if(!pe){
        pe = ss.insertSheet("Perdidas");
        pe.appendRow(["Fecha envio","Fecha reporte","Operario","Lote","Bodega","SKU","Producto","Cantidad","Causa","Comentarios"]);
        pe.getRange("A1:J1").setFontWeight("bold").setBackground("#E0712E").setFontColor("#ffffff");
      }
      data.perdidas.forEach(function(p){
        pe.appendRow([ts, data.fecha, data.operario, data.lote, data.bodega, p.sku||"", p.producto||"", p.cantidad||0, p.motivo||"", p.comentarios||""]);
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false, error:err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

function _json(obj){
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    const params = (e && e.parameter) ? e.parameter : {};
    if(params.action === "pendientes"){
      const destino = (params.destino||"").toLowerCase();
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const tr = ss.getSheetByName("Traslados");
      if(!tr) return _json({ok:true, pendientes:[]});
      const rng = tr.getDataRange().getValues();
      if(rng.length < 2) return _json({ok:true, pendientes:[]});
      const headers = rng[0];
      const idx = function(name){ return headers.indexOf(name); };
      const iDestino = idx("Destino");
      const iEstado = idx("Estado");
      const iID = idx("ID");
      if(iID < 0 || iEstado < 0) return _json({ok:true, pendientes:[]});
      const out = [];
      for(let i=1;i<rng.length;i++){
        const r = rng[i];
        const dest = String(r[iDestino]||"").toLowerCase();
        const est = String(r[iEstado]||"");
        if(est === "Pendiente" && (destino === "" || dest.indexOf(destino) >= 0)){
          out.push({
            id: r[iID],
            nt: r[idx("NT")] || "",
            fechaEnvio: r[idx("Fecha envio")],
            fechaReporte: r[idx("Fecha reporte")],
            operarioOrigen: r[idx("Operario")],
            origen: r[idx("Origen")],
            destino: r[iDestino],
            sku: r[idx("SKU")],
            producto: r[idx("Producto")],
            cantidad: r[idx("Cantidad")],
            unidad: r[idx("Unidad")] || "unds",
            estadoProd: r[idx("Estado producto")] || "",
            loteTraslado: r[idx("Lote traslado")] || "",
            motivo: r[idx("Motivo")],
            comentarios: r[idx("Comentarios")]
          });
        }
      }
      return _json({ok:true, pendientes:out});
    }
    return ContentService.createTextOutput("La Ocanera - Reportes API activo");
  } catch(err){
    return _json({ok:false, error:err.toString()});
  }
}

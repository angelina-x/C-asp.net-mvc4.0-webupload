using ImageUpload.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
namespace ImageUpload.Controllers
{
    public class HomeController : Controller
    {
        static string urlPath = string.Empty;
        public HomeController() 
        {
            var applicationPath = VirtualPathUtility.ToAbsolute("~") == "/" ? "" : VirtualPathUtility.ToAbsolute("~");
            urlPath = applicationPath + "/Upload";
            //var v1 = VirtualPathUtility.ToAbsolute("~/");
            //var v2 = HttpRuntime.AppDomainAppVirtualPath;
            //var v3 = Request.ApplicationPath;
            //var v4 = Page.ResolveUrl("~");
        
        }

        public ActionResult Index()
        {

            return View();
        }

        public string getPath()
        {
                        string pathw = Path.Combine(Request.PhysicalApplicationPath, "Upload");
                        return "HttpRuntime.AppDomainAppPath：" + Path.Combine(HttpRuntime.AppDomainAppPath, "Upload") + pathw + "--" + urlPath;
        }
        public string LoadData()
        {
            String passDic = ConfigurationManager.AppSettings["PassDictionary"];
            String passFileName = ConfigurationManager.AppSettings["PassFile"];
            String columnsName = ConfigurationManager.AppSettings["ColumnsName"];
            DataTable dt = new DataTable();
            //string filePath = Server.MapPath("/" + passDic + "") + "\\" + passFileName;  //C:\inpubput\wwwRoot
            string filePath = Path.Combine(Request.PhysicalApplicationPath, passDic + "\\" + passFileName);
            dt = CsvHelper.OpenCSV(filePath);
            
            string[] columns = columnsName.Split(',');

            if (columns.Length != 0 && columns != null)
            {
                for (int i = 0; i < columns.Length; i++)
                {
                    dt.Columns[i].ColumnName = columns[i];
                }
            }

            //dt.Columns[0].ColumnName = "file";
            //dt.Columns[1].ColumnName = "size";

            string strJson = JsonHelper.CreateJsonParameters(dt);
            //Response.Clear();
            //Response.Write(strJson);
            //Response.End();
;
            return strJson;
        }

        public ActionResult UpLoadProcess(string id, string name, string type, string lastModifiedDate, int size, HttpPostedFileBase file)
        {
            //var v5 = VirtualPathUtility.ToAbsolute("~/");
            //var v6 = HttpRuntime.AppDomainAppVirtualPath;
            //var v7 = Request.ApplicationPath;
            //var v8 = System.Web.UI.Page.ResolveUrl("~");
            string filePathName = string.Empty;

            //string localPath = Path.Combine(HttpRuntime.AppDomainAppPath, "Upload");
            string localPath = Path.Combine(Request.PhysicalApplicationPath,"Upload");
            //return localPath;
            if (Request.Files.Count == 0)
            {
                return Json(new { jsonrpc = 2.0, error = new { code = 102, message = "保存失败" }, id = "id" });
            }

            string ex = Path.GetExtension(file.FileName);
            filePathName = DateTime.Now.ToString("yyyyMMddHHmmssffff") + ex;
            if (!System.IO.Directory.Exists(localPath))
            {
                System.IO.Directory.CreateDirectory(localPath);
            }
            file.SaveAs(Path.Combine(localPath, filePathName));

            //error
            //String passfile = ConfigurationManager.AppSettings["PassFile"];
            //DataTable dt = new DataTable();
            //dt = CsvHelper.OpenCSV(Server.MapPath("/" + passfile + "") + "\\ocrtmbyw.csv");
            //dt.Columns[0].ColumnName = "files";
            //dt.Columns[1].ColumnName = "size";
            //string strJson = JsonHelper.CreateJsonParameters(dt);

            //Response.Write(strJson);
            LoadData();
            return Json(new { jsonrpc = "2.0"});
            //return Json(new
            //{
            //    jsonrpc = "2.0",
            //    id = id,
            //    filePath = urlPath + "/" + filePathName
            //});
        
        }

    }
}

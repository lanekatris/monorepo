using System.Text;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Markdig;
using Markdig.Extensions.Yaml;
using Markdig.Syntax;
using Newtonsoft.Json;
using Quartz;
using YamlDotNet.Serialization;

namespace Worker;

public record BlogFeedItem(string Name, string Contents);

public class CreateBlogFeed : IJob
{
    public static string RemapInternationalCharToAscii(char c)
    {
        string s = c.ToString().ToLowerInvariant();
        if ("àåáâäãåą".Contains(s))
        {
            return "a";
        }
        else if ("èéêëę".Contains(s))
        {
            return "e";
        }
        else if ("ìíîïı".Contains(s))
        {
            return "i";
        }
        else if ("òóôõöøőð".Contains(s))
        {
            return "o";
        }
        else if ("ùúûüŭů".Contains(s))
        {
            return "u";
        }
        else if ("çćčĉ".Contains(s))
        {
            return "c";
        }
        else if ("żźž".Contains(s))
        {
            return "z";
        }
        else if ("śşšŝ".Contains(s))
        {
            return "s";
        }
        else if ("ñń".Contains(s))
        {
            return "n";
        }
        else if ("ýÿ".Contains(s))
        {
            return "y";
        }
        else if ("ğĝ".Contains(s))
        {
            return "g";
        }
        else if (c == 'ř')
        {
            return "r";
        }
        else if (c == 'ł')
        {
            return "l";
        }
        else if (c == 'đ')
        {
            return "d";
        }
        else if (c == 'ß')
        {
            return "ss";
        }
        else if (c == 'Þ')
        {
            return "th";
        }
        else if (c == 'ĥ')
        {
            return "h";
        }
        else if (c == 'ĵ')
        {
            return "j";
        }
        else
        {
            return "";
        }
    }
    /// <summary>
    /// Produces optional, URL-friendly version of a title, "like-this-one". 
    /// hand-tuned for speed, reflects performance refactoring contributed
    /// by John Gietzen (user otac0n) 
    /// </summary>
    public static string URLFriendly(string title)
    {
        if (title == null) return "";

        const int maxlen = 80;
        int len = title.Length;
        bool prevdash = false;
        var sb = new StringBuilder(len);
        char c;

        for (int i = 0; i < len; i++)
        {
            c = title[i];
            if ((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9'))
            {
                sb.Append(c);
                prevdash = false;
            }
            else if (c >= 'A' && c <= 'Z')
            {
                // tricky way to convert to lowercase
                sb.Append((char)(c | 32));
                prevdash = false;
            }
            else if (c == ' ' || c == ',' || c == '.' || c == '/' || 
                     c == '\\' || c == '-' || c == '_' || c == '=')
            {
                if (!prevdash && sb.Length > 0)
                {
                    sb.Append('-');
                    prevdash = true;
                }
            }
            else if ((int)c >= 128)
            {
                int prevlen = sb.Length;
                sb.Append(RemapInternationalCharToAscii(c));
                if (prevlen != sb.Length) prevdash = false;
            }
            if (i == maxlen) break;
        }

        if (prevdash)
            return sb.ToString().Substring(0, sb.Length - 1);
        else
            return sb.ToString();
    }
    
    public async Task Execute(IJobExecutionContext context)
    {
        // load files, create, json, write to s3
        // var folder = @"C:\Users\looni\OneDrive\Documents\vault1\Blogs";
        var folder = @"C:\Users\looni\OneDrive\Documents\vault1\Blog\Published";
        var files = Directory.EnumerateFiles(folder);
        
        var markdown = File.ReadAllText(files.First());
        var pipeline = new MarkdownPipelineBuilder().UseYamlFrontMatter().Build();
        var document = Markdown.Parse(markdown, pipeline);
        var yamlBlock = document.Descendants<YamlFrontMatterBlock>().FirstOrDefault();
        var yaml = yamlBlock?.Lines.ToString() ?? "";
        var deserializer = new DeserializerBuilder().Build();
        var frontmatter = deserializer.Deserialize<Dictionary<string, object>>(yaml);

        var feed = files.Select(x => new BlogFeedItem(CreateBlogFeed.URLFriendly(Path.GetFileNameWithoutExtension(x)), File.ReadAllText(x)));
        var json = JsonConvert.SerializeObject(feed);

        // var credentials = new BasicAWSCredentials();
        var client = new AmazonS3Client();
        // var utility = new TransferUtility(client);
        //
        // var request = new TransferUtilityUploadRequest();
        // request

        var request = new PutObjectRequest
        {
            BucketName = "lkat-blog-test",
            Key = "feed.json",
            ContentBody = json,
            ContentType = "application/json"
        };
        var response = await client.PutObjectAsync(request);
        
        Console.WriteLine("done");
        
        // return Task.CompletedTask;
    }
}
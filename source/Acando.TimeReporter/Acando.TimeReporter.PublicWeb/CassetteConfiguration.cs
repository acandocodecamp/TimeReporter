using Cassette;
using Cassette.Scripts;
using Cassette.Stylesheets;

namespace Acando.TimeReporter
{
    public class CassetteBundleConfiguration : IConfiguration<BundleCollection>
    {
        public void Configure(BundleCollection bundles)
        {
            bundles.AddPerSubDirectory<StylesheetBundle>("Content/Acando");
            bundles.AddPerSubDirectory<ScriptBundle>("Scripts/Acando");
        }
    }
}
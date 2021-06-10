rootPath="FinancePortfolio/"
layoutFile="${rootPath}FinancePortfolio/Views/Shared/_Layout.cshtml";
CURRENT_VERSION=$(grep -hnr "kendo.cdn" $layoutFile | head -1 |cut -d '/' -f 4)
echo "Current release version from $layoutFile is $CURRENT_VERSION"

LAST_RELEASE=$(curl -s https://api.github.com/repos/telerik/kendo-ui-core/releases | grep tag_name | head -n 1 |  cut -d '"' -f 4)
echo "Last release version is $LAST_RELEASE"

files=(${rootPath}FinancePortfolio/FinancePortfolio.csproj ${rootPath}FinancePortfolio/Views/Shared/_Layout.cshtml)
for file in ${files[@]}
do
sed -i "s/$CURRENT_VERSION/$LAST_RELEASE/g" $file
done
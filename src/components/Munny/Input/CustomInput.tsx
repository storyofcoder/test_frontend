import { loadingOpacityMixin } from 'components/Loader/styled'
import ms from 'ms'
import { forwardRef, useCallback, useState } from 'react'
import styled from 'styled-components'
import { ThemedText } from 'theme/components'
import { flexColumnNoWrap, flexRowNoWrap } from 'theme/styles'

// import { ReactComponent as DropDown } from '../../../../assets/images/dropdown.svg'
import { Input as NumericalInput } from '../../NumericalInput'

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${flexColumnNoWrap};
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '16px' : '20px')};
  z-index: 1;
  width: ${({ hideInput }) => (hideInput ? '100%' : 'initial')};
  transition: height 1s ease;
  will-change: height;
`
const Container = styled.div<{ hideInput: boolean }>`
  min-height: 44px;
  border-radius: ${({ hideInput }) => (hideInput ? '16px' : '20px')};
  width: ${({ hideInput }) => (hideInput ? '100%' : 'initial')};
`

const InputRow = styled.div`
  ${flexRowNoWrap};
  align-items: center;
  justify-content: space-between;
`

const StyledNumericalInput = styled(NumericalInput)<{ $loading: boolean }>`
  ${loadingOpacityMixin};
  text-align: left;
  font-size: 30px;
  font-weight: 485;
  max-height: 44px;
`

const CustomInput = forwardRef<HTMLInputElement, any>(
  (
    {
      value,
      onUserInput,
      id,
      showCommonBases,
      showCurrencyAmount,
      disableNonToken,
      renderBalance,
      fiatValue,
      priceImpact,
      hideBalance = false,
      pair = null, // used for double token logo
      hideInput = false,
      locked = false,
      loading = false,
      disabled = false,
      numericalInputSettings,
      label,
      placeholder,
      ...rest
    },
    ref
  ) => {
    const [tooltipVisible, setTooltipVisible] = useState(false)
    const handleDisabledNumericalInputClick = useCallback(() => {
      if (numericalInputSettings?.disabled && !tooltipVisible) {
        setTooltipVisible(true)
        setTimeout(() => setTooltipVisible(false), ms('4s')) // reset shake animation state after 4s
        numericalInputSettings.onDisabledClick?.()
      }
    }, [tooltipVisible, numericalInputSettings])

    return (
      <InputPanel id={id} hideInput={hideInput} {...rest}>
        <Container hideInput={hideInput}>
          <ThemedText.SubHeaderSmall style={{ userSelect: 'none' }}>{label}</ThemedText.SubHeaderSmall>
          <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}}>
            {!hideInput && (
              <div style={{ display: 'flex', flexGrow: 1 }} onClick={handleDisabledNumericalInputClick}>
                <StyledNumericalInput
                  className="token-amount-input"
                  value={value}
                  onUserInput={onUserInput}
                  $loading={loading}
                  id={id}
                  ref={ref}
                  placeholder={placeholder}
                />
              </div>
            )}
          </InputRow>
        </Container>
      </InputPanel>
    )
  }
)
CustomInput.displayName = 'CustomInput'

export default CustomInput
